<!-- src/components/FamilyTree.vue -->
<template>
  <div class="tree-container" ref="treeContainer">
    <h1>信息编年记忆</h1>
    <div id="family-tree" class="chart" tabindex="0" @click="handleClick" @mousedown="handleMouseDown" @touchstart="handleTouchStart"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import * as d3 from 'd3';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

interface TreeNodeData {
  id: number;
  name?: string;
  image?: string;
  children?: TreeNodeData[];
}

export default defineComponent({
  name: 'FamilyTree',
  props: {
    treeData: {
      type: Object as () => TreeNodeData,
      default: () => ({
        id: 1,
        name: 'AETRIX Corp',
        children: [
          {
            id: 2,
            name: 'Pasta',
            image: '/src/assets/pasta.jpg',
            children: [
              { id: 3, name: 'Spaghetti Bolognese', image: '/src/assets/spaghetti.jpg' },
              { id: 4, name: 'Spaghetti Bolognese', image: '/src/assets/spaghetti.jpg' },
            ],
          },
          {
            id: 5,
            name: 'Pasta',
            image: '/src/assets/pasta.jpg',
            children: [
              { id: 6, name: 'Spaghetti Bolognese', image: '/src/assets/spaghetti.jpg' },
            ],
          },
        ],
      }),
    },
  },
  emits: ['select-node'],
  setup(props, { emit }) {
    const treeContainer = ref<HTMLElement | null>(null);
    let vantaEffect: any = null;
    let svg: any = null;
    let g: any = null;
    let scaleValue = 0.8;
    let panX = 0, panY = 0;
    let initialPan = { x: 0, y: 0 };
    let isDragging = false;
    let isRotating = false;
    let currentRotation = 0;
    let startX = 0, startRotation = 0;
    let pos = { x: 0, y: 0 };

    const initTree = () => {
      const container = d3.select('#family-tree');
      const width = 1200;
      const height = 800;

      svg = container
        .append('svg')
        .attr('width', '100%')
        .attr('height', height)
        .style('overflow', 'visible');

      g = svg.append('g');

      const treeLayout = d3.tree<TreeNodeData>()
        .size([height - 150, width - 200])
        .separation((a, b) => (a.parent === b.parent ? 1.5 : 2));

      const root = d3.hierarchy(props.treeData, (d) => d.children);
      treeLayout(root);

      // Straight connectors with horizontal and vertical segments
      g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('d', (d: any) => {
          const sourceX = d.source.y;
          const sourceY = d.source.x + 127; // Align to bottom of card
          const targetX = d.target.y;
          const targetY = d.target.x - 127; // Align to top of card
          const midX = (sourceX + targetX) / 2; // Midpoint for horizontal alignment
          return `M${sourceX},${sourceY} V${(sourceY + targetY) / 2} H${midX} V${targetY} H${targetX}`;
        })
        .style('stroke', '#fff')
        .style('stroke-width', '2px')
        .style('fill', 'none')
        .style('filter', 'drop-shadow(0 0 5px #ff0)') // Glowing effect
        .attr('marker-end', 'url(#arrowhead)'); // Optional arrowhead

      // Add arrowhead definition
      svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 5)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#fff');

      const node = g.selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .attr('class', (d: any) => `node card ${d.depth === 0 ? 'root-node' : ''}`)
        .attr('transform', (d: any) => `translate(${d.y},${d.x})`)
        .attr('data-id', (d: any) => d.data.id)
        .on('click', handleCardClick)
        .on('dblclick', (event, d: any) => handleDoubleClick(event, d))
        .on('mouseover', handleMouseOver)
        .on('mouseout', handleMouseOut);

      node.append('foreignObject')
        .attr('width', 190)
        .attr('height', 254)
        .attr('x', -95)
        .attr('y', -127)
        .html((d: any) => `
          <div class="content">
            <div class="back">
              <div class="back-content">
                <img src="${d.data.image || '/src/assets/white.png'}" alt="Logo" height="50px" width="50px"/>
                <strong>${d.data.name || 'AETRIX Corp'}</strong>
              </div>
            </div>
            <div class="front">
              <div class="img">
                <img src="${d.data.image || '/src/assets/default.jpg'}" alt="${d.data.name || 'Node'}" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
          </div>
        `);

      const zoom = d3.zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 1.5])
        .on('zoom', (event) => {
          g.attr('transform', event.transform);
          scaleValue = event.transform.k;
          updateTransform();
        });
      svg.call(zoom);

      svg.on('wheel', (event: WheelEvent) => {
        event.preventDefault();
        let newScale = scaleValue - event.deltaY * 0.001;
        newScale = Math.max(0.5, Math.min(1.5, newScale));
        scaleValue = newScale;
        svg.call(zoom.scaleTo as any, newScale);
      });
    };

    const handleCardClick = (event: MouseEvent, d: any) => {
      event.stopPropagation();
      const card = d3.select(event.currentTarget as HTMLElement).select('.content');
      card.classed('flipped', !card.classed('flipped'));
    };

    const handleDoubleClick = (event: MouseEvent, d: any) => {
      event.stopPropagation();
      const existing = document.querySelector('.enlarged-node');
      if (existing) existing.remove();

      const node = event.currentTarget as HTMLElement;
      const clone = node.cloneNode(true) as HTMLElement;
      const nodeId = node.getAttribute('data-id');
      clone.classList.add('enlarged-node');
      clone.style.position = 'fixed';
      clone.style.top = '50%';
      clone.style.left = '50%';
      clone.style.transform = 'translate(-50%, -50%) scale(3)';
      clone.querySelector('.content')!.style.transform = 'rotateY(180deg)';
      clone.style.animation = 'microMotion 0.6s ease-in-out';
      clone.addEventListener('click', (e) => {
        e.stopPropagation();
        emit('select-node', nodeId);
      });
      document.body.appendChild(clone);
    };

    const handleClick = (event: MouseEvent) => {
      const enlarged = document.querySelector('.enlarged-node');
      if (enlarged && !event.target.closest('.card')) {
        enlarged.remove();
      }
      treeContainer.value?.focus();
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (event.shiftKey) {
        isRotating = true;
        startX = event.clientX;
        startRotation = currentRotation;
        document.addEventListener('mousemove', mouseRotateHandler);
        document.addEventListener('mouseup', mouseRotateUpHandler);
      } else {
        isDragging = true;
        pos = { x: event.clientX, y: event.clientY };
        initialPan = { x: panX, y: panY };
        document.addEventListener('mousemove', mouseDragHandler);
        document.addEventListener('mouseup', mouseDragUpHandler);
      }
    };

    const mouseDragHandler = (event: MouseEvent) => {
      const dx = event.clientX - pos.x;
      const dy = event.clientY - pos.y;
      panX = initialPan.x + dx;
      panY = initialPan.y + dy;
      updateTransform();
    };

    const mouseDragUpHandler = () => {
      isDragging = false;
      document.removeEventListener('mousemove', mouseDragHandler);
      document.removeEventListener('mouseup', mouseDragUpHandler);
    };

    const mouseRotateHandler = (event: MouseEvent) => {
      const dx = event.clientX - startX;
      currentRotation = startRotation + dx * 0.5;
      updateTransform();
    };

    const mouseRotateUpHandler = () => {
      isRotating = false;
      document.removeEventListener('mousemove', mouseRotateHandler);
      document.removeEventListener('mouseup', mouseRotateUpHandler);
    };

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      if (event.touches.length === 1) {
        isDragging = true;
        pos = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        initialPan = { x: panX, y: panY };
        document.addEventListener('touchmove', touchDragHandler, { passive: false });
        document.addEventListener('touchend', touchEndHandler, { passive: false });
      }
    };

    const touchDragHandler = (event: TouchEvent) => {
      event.preventDefault();
      const dx = event.touches[0].clientX - pos.x;
      const dy = event.touches[0].clientY - pos.y;
      panX = initialPan.x + dx;
      panY = initialPan.y + dy;
      updateTransform();
    };

    const touchEndHandler = () => {
      isDragging = false;
      document.removeEventListener('touchmove', touchDragHandler);
      document.removeEventListener('touchend', touchEndHandler);
    };

    const handleMouseOver = (event: MouseEvent) => {
      const card = d3.select(event.currentTarget as HTMLElement);
      card.transition().duration(200).attr('transform', (d: any) => `translate(${d.y},${d.x - 5})`); // Lift up 5px
    };

    const handleMouseOut = (event: MouseEvent) => {
      const card = d3.select(event.currentTarget as HTMLElement);
      card.transition().duration(200).attr('transform', (d: any) => `translate(${d.y},${d.x})`);
    };

    const updateTransform = () => {
      if (svg) {
        svg.style.transform = `translate(${panX}px, ${panY}px) scale(${scaleValue}) rotate(${currentRotation}deg)`;
      }
    };

    const initVanta = () => {
      if (typeof FOG !== 'function') {
        console.error('FOG is not a function. Check Vanta import.');
        return;
      }
      vantaEffect = FOG({
        THREE,
        el: document.body,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        highlightColor: 0xffff00, // Gold
        midtoneColor: 0x0000ff, // Blue
        lowlightColor: 0x000000, // Black
        baseColor: 0x000000, // Black
        blurFactor: 0.5,
        speed: 1.0,
      });
    };

    onMounted(() => {
      initTree();
      initVanta();
    });

    onUnmounted(() => {
      if (vantaEffect) vantaEffect.destroy();
    });

    return { treeContainer };
  },
});
</script>

<style scoped>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: transparent;
}

.tree-container {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: auto;
  position: relative;
}

h1 {
  height: 60px;
  line-height: 60px;
  text-align: center;
  margin-bottom: 30px;
  color: #fff;
  font-size: 24px;
  font-weight: normal;
}

.chart {
  position: relative;
  height: auto;
  left: 0;
  right: 0;
  bottom: 0;
  transform: scale(var(--scale, 0.8));
  transform-origin: top center;
  transition: transform 0.5s cubic-bezier(0.22, 0.61, 0.36, 1);
  cursor: grab;
}

.chart:active {
  cursor: grabbing;
}

.card {
  overflow: visible;
  width: 190px;
  height: 254px;
  background-color: #000;
  border-radius: 5px;
  transition: transform 0.2s ease;
}

.content {
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.3s;
  border-radius: 5px;
}

.front, .back {
  background-color: #000;
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  border-radius: 5px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}

.back {
  transform: rotateY(180deg);
  background: linear-gradient(90deg, transparent, #ff9966, transparent);
  animation: glowAnimation 2s infinite;
}

.back-content {
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.back-content img {
  height: 50px;
  width: 50px;
}

.front {
  transform: rotateY(0deg);
}

.front .img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

@keyframes glowAnimation {
  0% { box-shadow: 0 0 5px #ff9966; }
  50% { box-shadow: 0 0 10px #ff9966; }
  100% { box-shadow: 0 0 5px #ff9966; }
}

.enlarged-node {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(3);
  transition: transform 0.3s ease, opacity 0.3s ease;
  z-index: 3000;
  background: #000;
  border-radius: 5px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}

@keyframes microMotion {
  0% { transform: translate(-50%, -50%) scale(2.8); }
  50% { transform: translate(-50%, -50%) scale(3.2); }
  100% { transform: translate(-50%, -50%) scale(3); }
}

.card.flipped .content {
  transform: rotateY(180deg);
}
</style>