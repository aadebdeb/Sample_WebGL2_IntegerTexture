# Sample_WebGL2_IntegerTexture

Sample of writing & reading integer texture in WebGL2

### Create Integer Texture

```js
const texture = gl.createTexture();
gl.bindTexture(gl.TEXTURE_2D, texture);
gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32I, sizeX, sizeY, 0, gl.RGBA_INTEGER, gl.INT, null);
```

### Write to Integer Texture

```glsl
#version 300 es

precision highp float;

out ivec4 value;

void main(void) {
  ivec2 coord = ivec2(gl_FragCoord.xy);
  value = ivec4((coord.x + coord.y + ivec3(0, 2, 4)) % 8, 0);
}
```

### Read Integer Texture

```glsl
#version 300 es

precision highp float;
precision highp isampler2D;

out vec4 color;

uniform isampler2D tex;
uniform vec2 resolution;

void main(void) {
  vec2 uv = gl_FragCoord.xy / resolution;
  ivec3 v = texture(tex, uv).rgb;
  color = vec4(vec3(v) / 8.0, 1.0);
}
```