const VERTICES_POSITION = new Float32Array([
  -1.0, -1.0,
  1.0, -1.0,
  -1.0,  1.0,
  1.0,  1.0
]);

const VERTICES_INDEX = new Int16Array([
  0, 1, 2,
  3, 2, 1
]);

const VERTEX_SHADER_SOURCE =
`#version 300 es

layout (location = 0) in vec2 position;

void main(void) {
  gl_Position = vec4(position, 0.0, 1.0);
}
`


function createShader(gl, source, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(gl.getShaderInfoLog(shader) + source);
  }
  return shader;
}

function createProgram(gl, vertexShaderSource, fragmentShaderSource) {
  const program = gl.createProgram();
  gl.attachShader(program, createShader(gl, vertexShaderSource, gl.VERTEX_SHADER));
  gl.attachShader(program, createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program));
  }
  return program;
}

function createVbo(gl, array) {
  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, array, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vbo;
}

function createIbo(gl, array) {
  const ibo = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  return ibo;
}

function createVao(gl, vboObjs, ibo) {
  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  if (ibo !== undefined) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  }
  vboObjs.forEach((vboObj) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, vboObj.buffer);
    gl.enableVertexAttribArray(vboObj.index);
    gl.vertexAttribPointer(vboObj.index, vboObj.size, gl.FLOAT, false, 0, 0);
  });
  gl.bindVertexArray(null);
  if (ibo !== undefined) {
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  return vao;
}
