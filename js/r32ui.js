(function() {

    const WRITE_TO_TEXTURE_FRAGMENT_SHADER_SOURCE =
`#version 300 es

precision highp float;

out uint value;

void main(void) {
ivec2 coord = ivec2(gl_FragCoord.xy);
value = uint(coord.x + coord.y) % 8u;
}
`;
  
    const RENDER_FRAGMENT_SHADER_SOURCE =
`#version 300 es

precision highp float;
precision highp usampler2D;

out vec4 color;

uniform usampler2D tex;
uniform vec2 resolution;

void main(void) {
vec2 uv = gl_FragCoord.xy / resolution;
uint v = texture(tex, uv).r;
color = vec4(vec3(v) / 8.0, 1.0);
}
`
  
    function createTexture(gl, sizeX, sizeY) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32UI, sizeX, sizeY, 0, gl.RED_INTEGER, gl.UNSIGNED_INT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return texture;
    }
  
    function createFramebuffer(gl, size) {
      const framebuffer = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
      const texture = createTexture(gl, size, size);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.bindTexture(gl.TEXTURE_2D, null);
      return {
        framebuffer: framebuffer,
        texture: texture
      };
    }
  
    const canvas = document.getElementById('canvas');
    const gl = canvas.getContext('webgl2');
  
    const writeToTextureProgram = createProgram(gl, VERTEX_SHADER_SOURCE, WRITE_TO_TEXTURE_FRAGMENT_SHADER_SOURCE);
    const renderProgram = createProgram(gl, VERTEX_SHADER_SOURCE, RENDER_FRAGMENT_SHADER_SOURCE);
  
    const vao = createVao(gl,
      [{buffer: createVbo(gl, VERTICES_POSITION), size: 2, index: 0}],
      createIbo(gl, VERTICES_INDEX)
    );
  
    // create framebuffer to write to texture
    const textureSize = 128;
    const fbObj = createFramebuffer(gl, textureSize);
  
    // write to texture
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbObj.framebuffer);
    gl.viewport(0.0, 0.0, textureSize, textureSize);
    gl.useProgram(writeToTextureProgram);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  
    // render to canvas
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    gl.useProgram(renderProgram);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbObj.texture);
    gl.uniform1i(gl.getUniformLocation(renderProgram, 'tex'), 0);
    gl.uniform2f(gl.getUniformLocation(renderProgram, 'resolution'), canvas.width, canvas.height);
    gl.bindVertexArray(vao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    gl.bindVertexArray(null);
  }());