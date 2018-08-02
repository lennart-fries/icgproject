/**
 * A class creating buffers for an axis aligned box to render it with WebGL
 */
class RasterBox {
    /**
     * Creates all WebGL buffers for the box
     *     6 ------- 7
     *    / |       / |
     *   3 ------- 2  |
     *   |  |      |  |
     *   |  5 -----|- 4
     *   | /       | /
     *   0 ------- 1
     *  looking in negative z axis direction
     * @param {WebGLContext} gl - The canvas' context
     * @param {Vector} minPoint - The minimal x,y,z of the box
     * @param {Vector} maxPoint - The maximal x,y,z of the box
     */
    constructor(gl, minPoint, maxPoint) {
        this.gl = gl;
        const mi = minPoint;
        const ma = maxPoint;
        let vertices = [
            mi.x, mi.y, ma.z,
            ma.x, mi.y, ma.z,
            ma.x, ma.y, ma.z,
            mi.x, ma.y, ma.z,
            ma.x, mi.y, mi.z,
            mi.x, mi.y, mi.z,
            mi.x, ma.y, mi.z,
            ma.x, ma.y, mi.z
        ];
        let indices = [
            // front
            0, 1, 2, 2, 3, 0,
            // back
            4, 5, 6, 6, 7, 4,
            // right
            1, 4, 7, 7, 2, 1,
            // top
            3, 2, 7, 7, 6, 3,
            // left
            5, 0, 3, 3, 6, 5,
            // bottom
            5, 4, 1, 1, 0, 5
        ];
        let colors = [
            0.0, 0.0, 0.0, 1.0,    // schwarz
            0.0, 0.0, 0.0, 1.0,    // schwarz
            0.0, 0.0, 0.0, 1.0,    // schwarz
            0.0, 0.0, 0.0, 1.0,    // schwarz
            //untenrechts
            0.0, 1.0, 0.0, 1.0,    // grün
            //untenlinks
            1.0, 0.0, 0.0, 1.0,    // rot
            //obenlinks
            1.0, 0.0, 1.0, 1.0,    // rosa
            //obenrechts
            0.0, 0.0, 1.0, 1.0,    // blau
        ];
        let normals = [
            // front
            0.0, 0.0, 1.0,
            // back
            0.0, 0.0, -1.0,
            // right
            1.0, 0.0, 0.0,
            // top
            0.0, 1.0, 0.0,
            // left
            -1.0, 0.0, 0.0,
            // bottom
            0.0, -1.0, 0.0,
        ];

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        this.vertexBuffer = vertexBuffer;

        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
        this.indexBuffer = indexBuffer;
        this.elements = indices.length;

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        this.colorBuffer = colorBuffer;

        const normalBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
        this.normalBuffer = normalBuffer;

    }

    /**
     * Renders the box
     * @param {Shader} shader - The shader used to render
     */
    render(shader) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        const positionLocation = shader.getAttributeLocation("a_position");
        this.gl.enableVertexAttribArray(positionLocation);
        this.gl.vertexAttribPointer(positionLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        const colorLocation = shader.getAttributeLocation("a_color");
        this.gl.enableVertexAttribArray(colorLocation);
        this.gl.vertexAttribPointer(colorLocation, 4, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.normalBuffer);
        const normalLocation = shader.getAttributeLocation("a_normal");
        this.gl.enableVertexAttribArray(normalLocation);
        this.gl.vertexAttribPointer(normalLocation, 3, this.gl.FLOAT, false, 0, 0);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.drawElements(this.gl.TRIANGLES, this.elements, this.gl.UNSIGNED_SHORT, 0);

        this.gl.disableVertexAttribArray(positionLocation);
        this.gl.disableVertexAttribArray(colorLocation);
    }
}