export interface Badge {
  [key: string]: boolean;
}

export interface Organization {
  id: string;
  url: string;
}

export interface QuserState {
  organizationId?: string;
  organizations?: Organization[];
}

export interface ReplaceActions {
  [key: string]: () => void; // O el tipo de función o valor específico esperado
}

export interface ControllerProps {
  gutter: string;
  size: string;
  replaceActions: ReplaceActions;
}
