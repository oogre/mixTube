


export function lerp (start, end, amt){
  return (1-amt)*start+amt*end
}

export function invlerp(x, y, a) {
	clamp((a - x) / (y - x));
}

export function clamp(a, min = 0, max = 1){
	Math.min(max, Math.max(min, a));
}