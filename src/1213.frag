precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#pragma glslify: rotateY = require(glsl-y-rotate/rotateY)
#pragma glslify: noise   = require(glsl-noise/simplex/3d)
#pragma glslify: sphere  = require(./sphere)
#pragma glslify: box     = require(./box)


float dist_func(vec3 pos) {
  float t = 1.+(sin(time*2.)+2.)* 3.;
  vec3 o = 2.0 * vec3(cos(time*.3),sin(time*.3),.0);
  o = vec3(mouse * 2., 0.0);
  float mr = 3.;
  vec3 q = pos - o*mr;
  pos = mod(q,mr) -0.5*mr;

  vec3 a = q / mr;
  float s = sphere(pos, 0.4);
  float b = box(pos,vec3(0.3));

  float sum = (a.x + a.y + a.z);
  float amari = sum - mr * floor(sum/mr);
  if(step(1.0,amari) == 1.0) return s;
  return max(-s,box(rotateY(time*0.6) * pos,vec3(0.3) ) );

}
vec3 getNormal(vec3 pos) {
  float ep = 0.0001;
  return normalize(vec3(
        dist_func(vec3(pos.x +ep, pos.y,     pos.z    )) - dist_func(vec3(pos.x -ep, pos.y,     pos.z    )),
        dist_func(vec3(pos.x,     pos.y +ep, pos.z    )) - dist_func(vec3(pos.x,     pos.y -ep, pos.z    )),
        dist_func(vec3(pos.x,     pos.y,     pos.z +ep)) - dist_func(vec3(pos.x,     pos.y,     pos.z -ep))
        )); 
}

vec3 getColor(float diff) {
  vec3 blue = vec3(0.,0.,0.8);

  if(diff > 0.7)      return vec3(1.0);
  else if(0.3 < diff && diff <= 0.7) { 
    float t = smoothstep(0.3,0.6,diff);
    t = pow(t,6.);
    return (vec3(0.3) + blue) * (1.-t) + vec3(1.0) * t;
  }
  else if(0.0 < diff && diff <= 0.3) { 
    float t = smoothstep(0.0,0.3,diff);
    t = pow(t,6.);
    return vec3(0.0) * (1.-t) + (vec3(0.3) + blue) * t;
  }
  else return vec3(0.2) + vec3(0.0,0.0,0.4);
  return vec3(diff) + vec3(0.2);
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  vec3 color = vec3(0.0);
  vec3 cameraPos = vec3(0.0, 0.0, 3.0);
  vec3 ray = normalize(vec3(p, 0.0) - cameraPos);
  vec3 cur = cameraPos;
  vec3 lightDir = normalize( vec3(1.0) + rotateY(time*-3.5) * vec3(.0, .1, .1) );

  for(int i=0; i<60; i++){
    float d = dist_func(cur);
    if( d < 0.00001 ) {
      vec3 normal = getNormal(cur);
      float diff = dot(normal, lightDir);
      if(diff < -0.0) continue;
      color = getColor(diff);
      break;
    }
    cur += ray * d;
  }
  gl_FragColor = vec4(color, 1.0);
}

