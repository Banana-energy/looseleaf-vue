// 从上游固定版本迁移为原生 Vue 组件；保留绘制参数与 CSS，并将派生状态转换为 computed。
import * as UI from "@/lib/types";
import { defineUi, omitProps, domProps, elementRef, jsxTag } from "@/lib/component";
import { createContext, useContext, watchDependencies, stateSetter, initialState, readSlot, renderValue, useExternalStore, useImperativeHandle, useLooseleafDirection, Suspense, lazy as vueLazy, memo as vueMemo, startTransition as vueStartTransition } from "@/lib/composables";
import { Children, cloneElement, createElement, isValidElement } from "@/lib/vnode";
import { cssStyle } from "@/lib/css";
import { computed } from "vue";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IndexCard, IndexCardContent, IndexCardFooter, IndexCardHeader, IndexCardTitle } from "@/components/ui/index-card";
import { Mascot } from "@/components/ui/mascot";
const Faq01Help = defineUi<{}>("Faq01Help", [], (_props, {
  slots: _slots
}) => {
  return () => {
    return <IndexCard flag="tangerine" seed="faq-help" class="min-h-0 max-w-none">
      <IndexCardHeader>
        <IndexCardTitle>
          <h3 class="inline">Still stuck?</h3>
        </IndexCardTitle>
        <Mascot pose="think" size={44} class="-mb-0.5 me-7" />
      </IndexCardHeader>
      <IndexCardContent>A real person answers, usually before lunch.</IndexCardContent>
      <IndexCardFooter>
        <Button asChild variant="link" size="sm" class="-ms-3">
          <a href="mailto:hello@penmark.example">
            <Icon name="mail" />
            Write to us
          </a>
        </Button>
      </IndexCardFooter>
    </IndexCard>;
  };
});
export { Faq01Help };
