float sphere(vec3 pos, float size) {
    return length(pos) - size;
}

#pragma glslify: export(sphere);
