<script setup lang="ts">
import { ref } from 'vue'
import { InkProvider } from '@/lib/ink/vue'
import { Paper } from '@/components/ui/paper'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Icon } from '@/components/ui/icon'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

// 此页作为绘制核心迁移的固定样板，后续完整文档站会复用这些原生 Vue 组件。
const checked = ref(true)
const saves = ref(0)
</script>

<template>
  <InkProvider :textures="true">
    <TooltipProvider>
      <main class="mx-auto grid max-w-5xl gap-10 px-8 py-16 font-hand text-foreground">
        <header>
          <p class="mb-4 flex items-center gap-2 text-muted-foreground">
            <Icon
              name="notebook"
              :size="28"
            /> A Vue component library
          </p>
          <h1 class="font-script text-7xl leading-none">
            Looseleaf Vue
          </h1>
          <p class="mt-4 text-2xl">
            shadcn/ui, <mark class="bg-hi/75 px-1">drawn by hand.</mark>
          </p>
        </header>
        <Paper
          stock="graph"
          :tilt="false"
          seed="vue-sample-paper"
          class="flex flex-wrap items-center gap-4 p-8"
        >
          <Button
            seed="vue-sample-button"
            @click="saves++"
          >
            Save changes
          </Button>
          <Button variant="destructive">
            Delete
          </Button>
          <Button variant="outline">
            Outline
          </Button>
          <Button variant="secondary">
            Secondary
          </Button>
          <Button variant="ghost">
            Ghost
          </Button>
          <Button variant="link">
            Read more
          </Button>
          <span data-testid="save-count">Saved {{ saves }} times</span>
        </Paper>
        <div class="grid gap-10 md:grid-cols-2">
          <Card
            :tilt="false"
            seed="vue-sample-card"
          >
            <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Choose what lands in your inbox.</CardDescription></CardHeader>
            <CardContent class="grid gap-5">
              <label class="grid gap-2">Email<Input
                placeholder="ada@looseleaf.dev"
                seed="vue-sample-input"
              /></label>
              <label class="flex items-center gap-3"><Checkbox
                v-model="checked"
                seed="vue-sample-checkbox"
              />Remember me</label>
            </CardContent>
            <CardFooter class="justify-end gap-3">
              <Button variant="outline">
                Cancel
              </Button><Button>Save</Button>
            </CardFooter>
          </Card>
          <Paper
            stock="sticky-yellow"
            seed="vue-sample-sticky"
            class="p-8"
          >
            <h2 class="mb-4 font-script text-4xl">
              A little note
            </h2>
            <p class="mb-6">
              Every surface is paper. Every line is drawn with a pen.
            </p>
            <Tooltip>
              <TooltipTrigger as-child>
                <Button variant="outline">
                  Hover for a note
                </Button>
              </TooltipTrigger><TooltipContent>Made with Vue.</TooltipContent>
            </Tooltip>
          </Paper>
        </div>
      </main>
    </TooltipProvider>
  </InkProvider>
</template>
