precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#pragma glslify: rotateX = require(glsl-y-rotate/rotateX)
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: noise   = require(glsl-noise/simplex/3d)
#pragma glslify: sphere  = require(./sphere)
#pragma glslify: box     = require(./box)

float dist_func(vec3 pos) {
  vec3 o = vec3(mouse * 3., time * 2.);
  float mr = .9;
  vec3 q = pos - o*mr;
  pos = mod(q,mr) -0.5*mr;

  mat3 rot = rotateY(time) * rotateX(time);
  float radius = .12 + .02 * sin(time);
  float _sphere = sphere(pos + rot * vec3(.01), radius);
  float _box = box(rot * pos, vec3(.1));
  return max( - _sphere, _box );
}
vec3 getNormal(vec3 pos) {
  float ep = 0.0001;
  return normalize(vec3(
        dist_func(vec3(pos.x +ep, pos.y,     pos.z    )) - dist_func(vec3(pos.x -ep, pos.y,     pos.z    )),
        dist_func(vec3(pos.x,     pos.y +ep, pos.z    )) - dist_func(vec3(pos.x,     pos.y -ep, pos.z    )),
        dist_func(vec3(pos.x,     pos.y,     pos.z +ep)) - dist_func(vec3(pos.x,     pos.y,     pos.z -ep))
        )); 
}

float map(float mi, float ma, float v) {
    float t = smoothstep(mi, ma, v);
    return pow(t, 6.);
}
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d  ) {
    return a + b*cos( 6.28318*(c*t+d)  );
}

vec3 getColor(float diff) {
  vec3 a = vec3(.7, .7, .7);
  vec3 b = vec3(.5, .5, .5);
  vec3 c = vec3(.9, .9, .9);
  vec3 d = vec3(.0, .1, .2);
  vec3 baseColor = palette(diff, a, b, c, d);

  return baseColor * diff;

  if(diff > 0.7) return vec3(1.0);
  if(0.3 < diff && diff <= 0.7) { 
    float t = map(0.3, 0.7, diff);
    return (vec3(0.3) + baseColor) * (1.-t) + vec3(1.0) * t;
  }
  if(0.0 < diff && diff <= 0.3) { 
    float t = map(0.0, 0.3, diff);
    return vec3(0.0) * (1.-t) + (vec3(0.3) + baseColor) * t;
  }
  else return vec3(0.2) + vec3(0.0,0.0,0.4);
  return vec3(diff) + vec3(0.2);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 color = vec3(.0);
  vec3 cameraPos = vec3(0.0, 0.0, 3.0);
  vec3 ray = normalize(vec3(p, 0.0) - cameraPos);
  vec3 cur = cameraPos;
  vec3 lightDir = normalize( vec3(1.0) + rotateY(time*-3.5) * vec3(.0, .1, .1) );

  for(int i=0; i<50; i++){
    float d = dist_func(cur);
    if( d < 0.00001 ) {
      vec3 normal = getNormal(cur);
      float diff = dot(normal, lightDir);
      color = getColor(diff);
      break;
    }
    cur += ray * d;
  }
  gl_FragColor = vec4(color, 1.0);
}

