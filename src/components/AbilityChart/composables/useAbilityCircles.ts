import { ref, computed, onMounted } from 'vue';
import type { AbilityItem } from '../types';
import { NUCLEUS_COLORS } from '../constants';

export function useAbilityCircles(abilities: AbilityItem[]) {
  const circles = ref<HTMLElement[]>([]);
  const container = ref<HTMLElement | null>(null);
  const pulseDotsGroup = ref<SVGGElement | null>(null);
  const connectionLinesGroup = ref<SVGGElement | null>(null);

  // 计算属性
  const centerX = computed(() => container.value ? container.value.offsetWidth / 2 : 250);
  const centerY = computed(() => container.value ? container.value.offsetHeight / 2 : 250);
  const radius = 180;
  // 添加随机浮动效果
  const addRandomFloat = (circle: HTMLElement, index: number) => {
    if (circle.floatInterval) {
      clearInterval(circle.floatInterval);
    }

    const baseDelay = index * 0.4;
    circle.style.animationDelay = `${baseDelay}s`;

    const angle = (index * (360 / abilities.length)) * (Math.PI / 180);
    const initialX = Math.cos(angle) * radius;
    const initialY = Math.sin(angle) * radius;
    const initialRotate = Math.random() * 360;

    circle.style.transform = `translate(${initialX}px, ${initialY}px) rotate(${initialRotate}deg)`;

    // 使用RAF代替setInterval
    const animate = () => {
      const randomX = (Math.random() - 0.5) * 15;
      const randomY = (Math.random() - 0.5) * 15;
      const randomRotate = (Math.random() - 0.5) * 3;
      const randomScale = 0.98 + Math.random() * 0.04;

      if (Math.abs(randomX) < 20 && Math.abs(randomY) < 20) {
        circle.style.transform = `
          translate3d(${randomX}px, ${randomY}px, 0)
          rotate(${randomRotate}deg)
          scale(${randomScale})
        `;
      }
      circle.rafId = requestAnimationFrame(animate);
    };
    circle.rafId = requestAnimationFrame(animate);
  };

  // 创建连接线
  const createConnectionLine = (x1: number, y1: number, x2: number, y2: number) => {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1.toString());
    line.setAttribute("y1", y1.toString());
    line.setAttribute("x2", x2.toString());
    line.setAttribute("y2", y2.toString());
    line.setAttribute("stroke", "rgba(255, 255, 255, 0.1)");
    line.setAttribute("stroke-width", "1");
    return line;
  };

  // 创建能力圆圈
  const createAbilityCircles = () => {
    if (!container.value || !pulseDotsGroup.value || !connectionLinesGroup.value) return;

    abilities.forEach((ability, index) => {
      const angle = (index * (360 / abilities.length)) * (Math.PI / 180);
      const x = centerX.value + Math.cos(angle) * radius;
      const y = centerY.value + Math.sin(angle) * radius;

      // 创建连接线
      const line = createConnectionLine(x, y, centerX.value, centerY.value);
      connectionLinesGroup.value?.appendChild(line);

      // 创建小球
      const circle = document.createElement('div');
      circle.className = 'sub-circle';

      // 添加神经元突起效果
      const neuronShape = document.createElement('div');
      neuronShape.className = 'neuron-shape';
      neuronShape.style.color = NUCLEUS_COLORS[index];
      neuronShape.style.setProperty('--rotation', `${index * 60}deg`);
      circle.appendChild(neuronShape);

      // 添加荧光边缘
      const glowEdge = document.createElement('div');
      glowEdge.className = 'glow-edge';
      glowEdge.style.setProperty('--glow-color', NUCLEUS_COLORS[index]);
      glowEdge.style.setProperty('--angle', `${index * 60}deg`);
      circle.appendChild(glowEdge);

      // 添加波纹效果
      const rippleContainer = document.createElement('div');
      rippleContainer.className = 'ripple-container';
      const ripples = Array.from({ length: 3 }, (_, i) => {
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        const baseColor = NUCLEUS_COLORS[index].replace('0.5', '0.2');
        ripple.style.borderColor = baseColor;
        ripple.style.filter = 'blur(1px) brightness(1.2)';
        rippleContainer.appendChild(ripple);
        return ripple;
      });
      circle.appendChild(rippleContainer);

      // 添加图标和细胞效果
      const iconContainer = document.createElement('div');
      iconContainer.className = 'icon-container';
      iconContainer.innerHTML = ability.icon;
      circle.appendChild(iconContainer);

      const nucleus = document.createElement('div');
      nucleus.className = 'nucleus';
      nucleus.style.background = `
        radial-gradient(
          circle at center,
          ${NUCLEUS_COLORS[index]} 0%,
          ${NUCLEUS_COLORS[index].replace('0.5', '0.3')} 40%,
          transparent 70%
        )
      `;

      const cytoplasm = document.createElement('div');
      cytoplasm.className = 'cytoplasm';
      
      circle.appendChild(nucleus);
      circle.appendChild(cytoplasm);

      // 设置位置和添加浮动效果
      circle.style.left = `${x - 45}px`;
      circle.style.top = `${y - 45}px`;
      addRandomFloat(circle, index);

      // 添加事件监听
      const handleMouseEnter = (e: MouseEvent) => {
        if (e.currentTarget !== circle) return;
        clearInterval(circle.floatInterval);

        // 触发波纹效果
        ripples.forEach((ripple, i) => {
          setTimeout(() => {
            const hoverColor = NUCLEUS_COLORS[index].replace('0.5', '0.4');
            ripple.style.borderColor = hoverColor;
            ripple.style.color = hoverColor;
            ripple.style.filter = 'blur(1.5px) brightness(1.5)';
            ripple.style.animation = 'none';
            ripple.offsetHeight;
            ripple.style.animation = 'rippleEffect 4s cubic-bezier(0.165, 0.84, 0.44, 1)';
          }, i * 300);
        });

        neuronShape.style.opacity = '0.6';
        glowEdge.style.opacity = '0.8';
        glowEdge.style.filter = 'blur(12px)';
      };

      const handleMouseLeave = (e: MouseEvent) => {
        if (e.currentTarget !== circle) return;
        addRandomFloat(circle, index);

        ripples.forEach(ripple => {
          ripple.style.animation = 'none';
          ripple.style.opacity = '0';
        });

        neuronShape.style.opacity = '0.4';
        glowEdge.style.opacity = '0.5';
        glowEdge.style.filter = 'blur(8px)';
      };

      circle.addEventListener('mouseenter', handleMouseEnter, { passive: true });
      circle.addEventListener('mouseleave', handleMouseLeave, { passive: true });

      // 存储事件处理函数引用以便清理
      circle._handlers = {
        mouseenter: handleMouseEnter,
        mouseleave: handleMouseLeave
      };

      // 添加脉冲点
      for (let i = 0; i < 3; i++) {
        const pulseDot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        pulseDot.setAttribute("class", "pulse-dot");
        pulseDot.setAttribute("data-index", index.toString());
        
        const randomDuration = Math.random() * 0.5;
        pulseDot.style.setProperty('--random-duration', `${randomDuration}s`);
        
        pulseDot.style.offsetPath = `path("M${x},${y} L${centerX.value},${centerY.value}")`;
        pulseDot.style.animationDelay = `${i * 1.2 + index * 0.3 + Math.random() * 0.5}s`;
        
        pulseDotsGroup.value?.appendChild(pulseDot);
      }

      container.value?.appendChild(circle);
      circles.value.push(circle);
    });
  };
  onMounted(() => {
    createAbilityCircles();
  });
  return {
    circles,
    container,
    pulseDotsGroup,
    connectionLinesGroup,
    createAbilityCircles
  };
} 