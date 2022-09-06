export default function formatLabel(label: string): string {
  if (label) return label.replace(/_/g, ' ');
  return '<?>';
}
