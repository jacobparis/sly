// http://localhost:3000/registry/@shadcn/ui.json
// https://sly-cli.fly.dev/registry/@shadcn/ui.json

import { json, type LoaderArgs } from "@remix-run/node"
import { z } from "zod"

const shadcnFile = z.object({
  name: z.string(),
  dependencies: z.array(z.string()).optional(),
  registryDependencies: z.array(z.string()).optional(),
  files: z.array(z.string()),
  type: z.string(),
})

export const meta = {
  name: "@shadcn/ui",
  source: "https://github.com/shadcn/ui",
  description:
    "Beautifully designed components that you can copy and paste into your apps.",
  license: "https://github.com/shadcn/ui/blob/main/LICENSE.md",
} as const

export async function loader({ request }: LoaderArgs) {
  const shadcn = await fetch("https://ui.shadcn.com/registry")
    .then((res) => res.json())
    .then(z.array(shadcnFile).parseAsync)

  const icons = shadcn.map((component) => ({
    name: component.name,
  }))

  return json({
    version: "1.0.0",
    meta,
    resources: icons,
  })
}