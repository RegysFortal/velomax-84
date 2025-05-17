
import React from "react";

export function FormLoadingState() {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
      <p className="mt-4 text-sm text-muted-foreground">Carregando formulário...</p>
    </div>
  );
}
