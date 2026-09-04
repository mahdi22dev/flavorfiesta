import Link from "next/link";
import { getRecipes, type AdminRecipe } from "../../actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Plus,
  ImageIcon,
  AlertCircle,
  Clock,
  ChefHat,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const QUALITY_STYLES: Record<string, string> = {
  excellent: "bg-emerald-600 text-white",
  good: "bg-emerald-500/15 text-emerald-700",
  moderate: "bg-amber-500/15 text-amber-700",
  bad: "bg-red-500/15 text-red-700",
  hallucination: "bg-red-600 text-white",
  pending: "bg-muted text-muted-foreground",
};

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1") || 1);

  const { data: recipes, total, pageSize, totalPages, error } =
    await getRecipes(page);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">
            Recipes
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            {total} recipe{total === 1 ? "" : "s"} in your library.
          </p>
        </div>
        <Button size="lg" render={<Link href="/admin/recipes/new" />}>
            <Plus size={16} />
            Generate Recipe with AI
          </Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center gap-3 py-4">
            <AlertCircle size={18} className="text-destructive shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {recipes.length === 0 && !error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon size={40} className="text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              No recipes yet. Create your first one with AI.
            </p>
            <Button size="lg" render={<Link href="/admin/recipes/new" />}>
                <Plus size={16} />
                Generate Recipe with AI
              </Button>
          </CardContent>
        </Card>
      ) : recipes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              {page > 1 ? (
                <Button variant="outline" size="sm" render={<Link href={`/admin/recipes?page=${page - 1}`} />}>
                    <ChevronLeft size={14} />
                    Previous
                  </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  <ChevronLeft size={14} />
                  Previous
                </Button>
              )}

              <span className="text-xs text-muted-foreground px-2">
                Page {page} of {totalPages} · {pageSize} per page
              </span>

              {page < totalPages ? (
                <Button variant="outline" size="sm" render={<Link href={`/admin/recipes?page=${page + 1}`} />}>
                    Next
                    <ChevronRight size={14} />
                  </Button>
              ) : (
                <Button variant="outline" size="sm" disabled>
                  Next
                  <ChevronRight size={14} />
                </Button>
              )}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: AdminRecipe }) {
  const quality = recipe.quality_score ?? "pending";

  return (
    <Card size="sm" className="overflow-hidden gap-0">
      <div className="aspect-[16/9] bg-muted relative">
        {recipe.coverImage ? (
          <img
            src={recipe.coverImage}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon size={22} className="text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1.5">
          {recipe.category && (
            <Badge variant="secondary" className="text-[9px] bg-white/90 backdrop-blur">
              {recipe.category}
            </Badge>
          )}
          <Badge
            variant={recipe.have_content ? "default" : "outline"}
            className={`text-[9px] ${recipe.have_content ? "" : "bg-white/90 backdrop-blur"}`}
          >
            {recipe.have_content ? "Ready" : "Draft"}
          </Badge>
        </div>
      </div>

      <CardHeader className="gap-0.5">
        <CardTitle className="text-sm leading-snug">{recipe.title}</CardTitle>
        <CardDescription className="text-xs line-clamp-1">
          {recipe.description || "No description yet."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {recipe.prep_time && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Prep {recipe.prep_time}
            </span>
          )}
          {recipe.cook_time && (
            <span className="flex items-center gap-1">
              <Clock size={11} />
              Cook {recipe.cook_time}
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <ChefHat size={11} />
              Serves {recipe.servings}
            </span>
          )}
          {recipe.created_at && (
            <span className="flex items-center gap-1">
              <CalendarDays size={11} />
              {new Date(recipe.created_at).toLocaleDateString()}
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <Badge className={`${QUALITY_STYLES[quality] ?? QUALITY_STYLES.pending} capitalize text-[9px] h-4`}>
            {quality}
          </Badge>
          <span className="text-[9px] font-mono text-muted-foreground/60">
            #{recipe.id}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}