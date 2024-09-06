export interface TimeTrack {
  start: number;
  end?: number;
  totalTime?: string;
}

export interface Task {
  id: string;
  name: string;
  time: TimeTrack[];
}

export interface Project {
  id: string;
  name: string;
}

export interface ProjectInfo {
  id: string;
  name: string;
  tasks: Task[];
}
