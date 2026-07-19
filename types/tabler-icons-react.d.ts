declare module '@tabler/icons-react' {
  import type { ComponentType, SVGProps } from 'react';

  type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

  export const IconBasket: IconComponent;
  export const IconCalendar: IconComponent;
  export const IconSearch: IconComponent;
  export const IconHome: IconComponent;
  export const IconSettings: IconComponent;
  export const IconLogout: IconComponent;
  export const IconUser: IconComponent;

  const _default: Record<string, IconComponent>;
  export default _default;
}
