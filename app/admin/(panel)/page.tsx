import Link from "next/link";
import { getAdminStats } from "../actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  UtensilsCrossed,
  CheckCircle2,
  FileEdit,
  Tags,
  Plus,
  AlertCircle,
} from "lucide-react";

export default async function OverviewPage() {
  const { data: stats, error } = await getAdminStats();

  const statCards = [
    {
      label: "Total Recipes",
      value: stats.totalRecipes,
      icon: UtensilsCrossed,
    },
    { label: "Ready", value: stats.ready, icon: CheckCircle2 },
    { label: "Drafts", value: stats.drafts, icon: FileEdit },
    { label: "Categories", value: stats.categories, icon: Tags },
  ] as const;

  return (
    <div className="max-w-4xl">
      <div className="mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Overview
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          A quick look at your recipe library.
        </p>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle size={18} className="text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader>
              <Icon size={22} className="text-orange-600" />
              <CardDescription className="text-sm">{label}</CardDescription>
              <CardTitle className="text-4xl">{value}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardContent className="flex flex-col items-center justify-center py-14">
          <p className="text-sm text-muted-foreground mb-4">
            Ready to create something new?
          </p>
          <Button size="lg" render={<Link href="/admin/recipes/new" />}>
              <Plus size={16} />
              Generate Recipe with AI
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}