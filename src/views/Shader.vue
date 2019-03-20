<template>
    <div>
        <div ref='stats'></div>
        <div ref='canvas' id='WebGL-output'></div>
        <!-- <h1>着色器</h1> -->
    </div>
</template>
<script>
import mixin from '../mixins/threeMixin';

const mainGroup = new THREE.Group();
export default {
    mixins: [mixin],
    methods: {
        initWebGL() {
            const {
                scene,
                camera,
                renderer,
            } = this.initBasics(this.$refs.canvas, { position: { x: 0, y: 0, z: 40 } }, { clearColor: 0xf1f1f1 });
            this.scene = scene;
            this.camera = camera;
            this.renderer = renderer;

            // this.addAxes();

            const plane = this.addPlane();

            const controls = this.addControl();

            scene.add(mainGroup);

            const clock = new THREE.Clock();
            const renderScene = () => {

                plane.material.uniforms.time.value += 0.01;

                const delta = clock.getDelta();
                controls.update(delta);
                requestAnimationFrame(renderScene);
                renderer.render(scene, camera);
            };

            renderScene();
        },
        addAxes() {
            const axes = this.initAxes();
            mainGroup.add(axes);
        },
        addPlane() {
            const geom = this.initGeometry('Plane', 60, 30);
            // const geom = this.initGeometry('Sphere', 30, 30, 30);
            const mat = this.createMaterial();
            const plane = new THREE.Mesh(geom, mat);
            mainGroup.add(plane);
            return plane;
        },
        createMaterial() {
            const vertexShader = this.initVertexShader();
            const fragmentShader = this.initFragmentShader();

            const uniforms = {
                tDiffuse: { type: 't', value: null },
                bitSize: { type: 'i', value: 4 },
                time: { type: 'f', value: 0.2 },
                resolution: { type: 'v2', value: this.v2(window.innerWidth, window.innerHeight) },
            };

            const mat = new THREE.ShaderMaterial({
                uniforms,
                vertexShader,
                fragmentShader,
                transparent: true,
                // side: THREE.DoubleSide,
            });

            return mat;
        },
        initVertexShader() {
            const vs = `
                uniform float time;
                varying vec2 vUv;

                void main() {
                    vUv = uv;
                    vec3 posChanged = position;
                    // posChanged.x = posChanged.x * (abs(sin(time)));
                    // posChanged.y = posChanged.y * (abs(sin(time)));
                    // posChanged.z = posChanged.z * (abs(sin(time)));
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged, 1.0);
                }
            `;
            return vs;
        },
        initFragmentShader() {
            const fs = `
                // uniform int bitSize;
                // uniform sampler2D tDiffuse;
                varying vec2 vUv;

                // void main() {
                //     vec4 texel = texture2D(tDiffuse, vUv);
                //     float n = pow(float(bitSize), 2.0);
                //     float newR = floor(texel.r * n) / n;
                //     float newG = floor(texel.g * n) / n;
                //     float newB = floor(texel.b * n) / n;
                //     // gl_FragColor = vec4(vec3(newR, newG, newB), 1.0);
                //     gl_FragColor = vec4(0.0, 0.0, 255.0, 0.5);
                // }

                // precision mediump float;
                uniform float time;
                uniform vec2 resolution;

                void main() {
                    vec3 color = vec3(1.0, 0.5, 0.4);

                    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

                    float a = (sin(p.x*p.y * 1.0 + time*0.2) + sin(p.x*p.x * 5.0 + time * 26.0)/3.0 + sin(p.x * 5.0 + time * 11.0)/6.0 + sin(p.x*p.x + time * 16.0)/4.0)*0.15;

                    float f = 0.4 / abs(abs(cos(time * 0.11)) * p.y + p.x * p.x * 3.0 + a);

                    gl_FragColor = vec4(color * f, 1.0);
                }
            `;
            return fs;
        },
        addControl() {
            const control = this.initControls('Trackball', this.camera, {
                rotateSpeed: 1.0,
                zoomSpeed: 1.0,
                panSpeed: 1.0,
            });
            return control;
        },
    },
    mounted() {
        this.initWebGL();
    }
};
</script>

<style lang='less' scoped>
#WebGL-output{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}
</style>