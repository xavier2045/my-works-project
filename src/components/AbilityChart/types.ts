// 定义类型
export interface AbilityItem {
  name: string;
  percentage: string;
  icon: string;
}

export interface AbilityGraphProps {
  abilities?: AbilityItem[];
  mainText?: string;
  companyInfo?: {
    name: string;
    cnName: string;
    slogan: string;
  };
} 