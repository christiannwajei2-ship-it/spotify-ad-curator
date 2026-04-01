export interface CampaignStep {
  id: string;
  label: string;
  description: string;
  icon: string;
  required: boolean;
  completed: boolean;
  items: PlacedItem[];
}

export interface PlacedItem {
  id: string;
  type: 'platform' | 'action' | 'creative';
  label: string;
  icon: string;
  color: string;
  metadata?: Record<string, string | number>;
}

export interface DragItem {
  id: string;
  type: PlacedItem['type'];
  label: string;
  icon: string;
  color: string;
}

export interface CampaignPipeline {
  id: string;
  name: string;
  steps: CampaignStep[];
  createdAt: string;
}

export interface PlatformCard {
  id: string;
  label: string;
  icon: string;
  color: string;
  type: PlacedItem['type'];
  description: string;
}
