import * as Vaul from 'vaul-vue'
import { primitive } from './primitive-adapter'

// 使用 Vaul 官方 Vue 移植版保留拖动、吸附和焦点管理行为。
export const Drawer = {
  Root: primitive(Vaul.DrawerRoot, 'Drawer', 'Root'),
  NestedRoot: primitive(Vaul.DrawerRootNested, 'Drawer', 'Root'),
  Trigger: primitive(Vaul.DrawerTrigger, 'Drawer', 'Trigger'),
  Close: primitive(Vaul.DrawerClose, 'Drawer', 'Close'),
  Portal: primitive(Vaul.DrawerPortal, 'Drawer', 'Portal'),
  Content: primitive(Vaul.DrawerContent, 'Drawer', 'Content'),
  Overlay: primitive(Vaul.DrawerOverlay, 'Drawer', 'Overlay'),
  Title: primitive(Vaul.DrawerTitle, 'Drawer', 'Title'),
  Description: primitive(Vaul.DrawerDescription, 'Drawer', 'Description'),
  Handle: primitive(Vaul.DrawerHandle, 'Drawer', 'Handle'),
}
