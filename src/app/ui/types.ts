export interface UIEvent<T, U extends Event> {
    payload?: T;
    originalEvent?: U
}

export type UIRole = 'default' | 'success' | 'primary' | 'warning' | 'danger';