import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export type PostProcessProfile = "strict" | "balanced" | "creative"

export interface PostProcessSettings {
  humanizeOnOutput: boolean
  preserveFactsStrictly: boolean
  matchMyVoice: boolean
  postProcessProfile: PostProcessProfile
  voiceSample: string
}

interface PostProcessControlsProps {
  settings: PostProcessSettings
  onChange: (next: PostProcessSettings) => void
  compact?: boolean
  title?: string
}

export function PostProcessControls({
  settings,
  onChange,
  compact = false,
  title = "Output Humanizer",
}: PostProcessControlsProps) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <span className="text-[11px] text-muted-foreground">Per-request controls</span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex items-center justify-between rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-xs">
          <span className="text-foreground">Humanize on output</span>
          <Switch
            checked={settings.humanizeOnOutput}
            onCheckedChange={(checked) => onChange({ ...settings, humanizeOnOutput: Boolean(checked) })}
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-xs">
          <span className="text-foreground">Preserve facts strictly</span>
          <Switch
            checked={settings.preserveFactsStrictly}
            onCheckedChange={(checked) => onChange({ ...settings, preserveFactsStrictly: Boolean(checked) })}
          />
        </label>

        <label className="flex items-center justify-between rounded-lg border border-border/50 bg-background/80 px-3 py-2 text-xs">
          <span className="text-foreground">Match my voice</span>
          <Switch
            checked={settings.matchMyVoice}
            onCheckedChange={(checked) => onChange({ ...settings, matchMyVoice: Boolean(checked) })}
          />
        </label>
      </div>

      <div className="grid gap-2 md:grid-cols-[220px_1fr] md:items-center">
        <span className="text-xs text-muted-foreground">Policy profile</span>
        <Select
          value={settings.postProcessProfile}
          onValueChange={(value) => onChange({ ...settings, postProcessProfile: value as PostProcessProfile })}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="strict">Strict</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {settings.matchMyVoice && !compact && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Voice sample (optional, 2-3 paragraphs)</p>
          <Textarea
            value={settings.voiceSample}
            onChange={(e) => onChange({ ...settings, voiceSample: e.target.value })}
            placeholder="Paste your writing sample so AI responses can mirror your tone and rhythm..."
            className="min-h-[96px] text-sm"
            maxLength={3000}
          />
        </div>
      )}
    </div>
  )
}
