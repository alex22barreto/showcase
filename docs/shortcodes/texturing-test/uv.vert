uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

attribute vec3 aPosition;    // Vertex position
attribute vec2 aTexCoord;    // Vertex texture coordinate
attribute vec3 aNormal;      // Vertex normal
attribute vec4 aVertexColor; // Vertex color

// =====================================

varying vec3 vPosition;
varying vec2 vTexCoord;

void main() {

  // Store the vertex position for use in the fragment shader
  vPosition = aPosition;
  vTexCoord = aTexCoord;

  // Set the vertex position without any change besides the view transformations
  // Note: it is important to apply these matrices to get your shape to render in the correct location
  gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aPosition, 1.0);
}