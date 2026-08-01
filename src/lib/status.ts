export function statusVariant(
  status: string
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "HIRED":
      return "default";
    case "INTERVIEW":
      return "outline";
    case "REJECTED":
      return "destructive";
    default:
      return "secondary";
  }
}
