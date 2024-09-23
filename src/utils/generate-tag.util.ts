export function generateTag(
  tag: string,
  value: string | number,
  attrs?: Record<string, string>,
) {
  const attrStr = attrs
    ? ` ${Object.entries(attrs)
        .filter((arr) => arr[1])
        .map((arr) => `${arr[0]}="${arr[1]}"`)
        .join(' ')}`
    : '';
  return `<${tag}${attrStr}>${value}</${tag}>`;
}
