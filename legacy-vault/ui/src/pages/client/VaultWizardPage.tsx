import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { ArchivalAssistant } from '@/components/legacy/ArchivalAssistant'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HeirDraft {
  id: string
  name: string
}

const TOKENIZED_ASSETS = [
  { id: 'NFT-7721', label: 'Primary Residence (NYC)', type: 'NFT' },
  { id: 'TKN-9004', label: 'Family Trust Funds', type: 'TKN' },
]

export function VaultWizardPage() {
  const [vaultName, setVaultName] = useState('My Will')
  const [heirInput, setHeirInput] = useState('')
  const [heirs, setHeirs] = useState<HeirDraft[]>([
    { id: 'alex.h', name: 'Alex Henderson' },
  ])
  const [oracleId, setOracleId] = useState('ORC-992-XXXX')
  const [checkIn, setCheckIn] = useState('30')

  function addHeir() {
    const name = heirInput.trim()
    if (!name) return
    setHeirs((prev) => [...prev, { id: `heir-${prev.length}`, name }])
    setHeirInput('')
  }

  return (
    <div className="space-y-6">
      <p className="font-headline text-[0.65rem] tracking-widest text-muted-foreground uppercase">
        Step 1 of 3: Designate Heirs
      </p>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <div>
            <h1 className="font-headline text-2xl font-bold">Create New Vault</h1>
            <p className="text-sm text-muted-foreground">
              Configure heirs, oracle, and tokenized assets for your archival vault.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="font-headline text-[0.65rem] tracking-widest uppercase">
              Vault Name
            </Label>
            <Input
              value={vaultName}
              onChange={(e) => setVaultName(e.target.value)}
              placeholder="e.g., My Will"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-headline text-[0.65rem] tracking-widest uppercase">
              Heirs
            </Label>
            <div className="flex gap-2">
              <Input
                value={heirInput}
                onChange={(e) => setHeirInput(e.target.value)}
                placeholder="Enter name or wallet ID"
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                className="font-headline text-[0.65rem] tracking-wider"
                onClick={addHeir}
              >
                <Plus className="size-3.5" />
                ADD HEIR
              </Button>
            </div>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {heirs.map((h) => (
                <li key={h.id} className="rounded border border-border bg-card px-3 py-2">
                  {h.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <Label className="font-headline text-[0.65rem] tracking-widest uppercase">
              Oracle Party ID
            </Label>
            <Input
              value={oracleId}
              onChange={(e) => setOracleId(e.target.value)}
              placeholder="ORC-992-XXXX"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-headline text-[0.65rem] tracking-widest uppercase">
              Check-in Interval
            </Label>
            <Select value={checkIn} onValueChange={(v) => v && setCheckIn(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-headline text-[0.65rem] tracking-widest uppercase">
              Assets (Tokenized)
            </Label>
            <ul className="space-y-2">
              {TOKENIZED_ASSETS.map((asset) => (
                <li
                  key={asset.id}
                  className="flex items-center justify-between rounded border border-border bg-card px-3 py-2 text-sm"
                >
                  <span>{asset.label}</span>
                  <span className="font-headline text-xs text-muted-foreground">{asset.id}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="text-sm text-primary underline">
              LINK MORE ASSETS
            </button>
          </div>

          <Card className="rounded-sm shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="font-headline text-xs tracking-wider uppercase">
                Privacy Preview: Who Can See What
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left font-headline text-[0.6rem] tracking-wider uppercase text-muted-foreground">
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Access</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">Testator (You)</td>
                    <td className="px-4 py-2 text-[var(--lv-success)]">FULL ACCESS ✓</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="px-4 py-2">Heirs</td>
                    <td className="px-4 py-2">VIEW ONLY ✓</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">Oracle</td>
                    <td className="px-4 py-2">TRIGGER ONLY ✓</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          <div className="flex flex-wrap gap-3 border-t border-border pt-6">
            <Link to="/vaults" className={buttonVariants({ variant: 'outline' })}>
              BACK
            </Link>
            <Button variant="ghost" type="button">
              SAVE DRAFT
            </Button>
            <Button type="button" className="font-headline text-xs tracking-widest">
              NEXT
            </Button>
          </div>
        </div>

        <ArchivalAssistant />
      </div>
    </div>
  )
}
