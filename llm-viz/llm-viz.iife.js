(function(){"use strict";function ri(i){return i!=null}function Z(i,e,t,l,r){if(r&&r.length!==l.length)throw new Error(`Number of texture names (${r.length}) does not match number of src textures (${l.length})`);let o=i.createFramebuffer();i.bindFramebuffer(i.FRAMEBUFFER,o);for(let s=0;s<t.length;s++)i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+s,i.TEXTURE_2D,t[s].texture,0);i.drawBuffers(t.map((s,a)=>i.COLOR_ATTACHMENT0+a));let n=i.checkFramebufferStatus(i.FRAMEBUFFER);return n!==i.FRAMEBUFFER_COMPLETE&&console.log("createRenderPhase: framebuffer not complete: "+n),{destBuffers:t,srcBuffers:l,fbo:o,program:e,uniformNames:r,uniformsSet:!1}}function N(i,e,t,l){let r=i.createTexture();i.bindTexture(i.TEXTURE_2D,r);let[o,n]=oi(i,l);return i.texImage2D(i.TEXTURE_2D,0,n,e,t,0,o,i.FLOAT,null),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),{width:e,height:t,texture:r,channels:l}}function ce(i,e,t){if(t.length!==e.width*e.height*e.channels)throw new Error("Data length does not match buffer size");i.bindTexture(i.TEXTURE_2D,e.texture);let[l]=oi(i,e.channels);i.texSubImage2D(i.TEXTURE_2D,0,0,0,e.width,e.height,l,i.FLOAT,t)}function oi(i,e){switch(e){case 1:return[i.RED,i.R32F];case 2:return[i.RG,i.RG32F];case 3:return[i.RGB,i.RGB32F];case 4:return[i.RGBA,i.RGBA32F];default:throw new Error(`Invalid number of channels: ${e}. Must be 1, 2, 3, or 4.`)}}var T=(i=>(i[i.X=0]="X",i[i.Y=1]="Y",i[i.Z=2]="Z",i))(T||{});const H=class H{constructor(e=0,t=0,l=0){this.x=+e,this.y=+t,this.z=+l}add(e){return new H(this.x+e.x,this.y+e.y,this.z+e.z)}sub(e){return new H(this.x-e.x,this.y-e.y,this.z-e.z)}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}mul(e){return new H(this.x*e,this.y*e,this.z*e)}mulAdd(e,t){return new H(this.x+e.x*t,this.y+e.y*t,this.z+e.z*t)}lenSq(){return this.x*this.x+this.y*this.y+this.z*this.z}distSq(e){let t=this.x-e.x,l=this.y-e.y,r=this.z-e.z;return t*t+l*l+r*r}len(){return Math.sqrt(this.lenSq())}dist(e){return Math.sqrt(this.distSq(e))}normalize(){return this.mul(1/Math.sqrt(this.lenSq()))}mid(e){return new H((this.x+e.x)*.5,(this.y+e.y)*.5,(this.z+e.z)*.5)}abs(){return new H(Math.abs(this.x),Math.abs(this.y),Math.abs(this.z))}clone(){return new H(this.x,this.y,this.z)}toVec4(){return new C(this.x,this.y,this.z,1)}round(){return new H(Math.round(this.x),Math.round(this.y),Math.round(this.z))}round_(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}copy_(e){this.x=e.x,this.y=e.y,this.z=e.z}static cross(e,t){return new H(e.y*t.z-e.z*t.y,e.z*t.x-e.x*t.z,e.x*t.y-e.y*t.x)}writeToBuf(e,t){e[t+0]=this.x,e[t+1]=this.y,e[t+2]=this.z}static fromArray(e,t=0){return new H(e[t+0],e[t+1],e[t+2])}setAt(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break}return this}addAt(e,t){switch(e){case 0:this.x+=t;break;case 1:this.y+=t;break;case 2:this.z+=t;break}return this}getAt(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z}return 0}withSetAt(e,t){return this.clone().setAt(e,t)}withAddAt(e,t){return this.clone().addAt(e,t)}toString(e=3){return`Vec3(${Ae(this.x,e)}, ${Ae(this.y,e)}, ${Ae(this.z,e)})`}rotateAbout(e,t){let l=Math.cos(t),r=Math.sin(t),o=H.cross(e,this),n=e.dot(this);return this.mul(l).add(o.mul(r)).add(e.mul(n*(1-l)))}lerp(e,t){return new H(e.x*t+this.x*(1-t),e.y*t+this.y*(1-t),e.z*t+this.z*(1-t))}};H.zero=new H(0,0,0),H.one=new H(1,1,1);let y=H;class C{constructor(e=0,t=0,l=0,r=1){this.x=+e,this.y=+t,this.z=+l,this.w=+r}getIdx(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error(`Invalid index ${e}`)}}add(e){return new C(this.x+e.x,this.y+e.y,this.z+e.z,this.w+e.w)}sub(e){return new C(this.x-e.x,this.y-e.y,this.z-e.z,this.w-e.w)}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w+e.w}mul(e){return new C(this.x*e,this.y*e,this.z*e,this.w*e)}lenSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}distSq(e){let t=this.x-e.x,l=this.y-e.y,r=this.z-e.z,o=this.w-e.w;return t*t+l*l+r*r+o*o}len(){return Math.sqrt(this.lenSq())}dist(e){return Math.sqrt(this.distSq(e))}normalize(){return this.mul(1/Math.sqrt(this.lenSq()))}projToVec3(){return new y(this.x/this.w,this.y/this.w,this.z/this.w)}static lerp(e,t,l){return e.add(t.sub(e).mul(l))}writeToBuf(e,t){e[t+0]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w}static fromArray(e,t=0){return new C(e[t+0],e[t+1],e[t+2],e[t+3])}static fromVec3(e,t=1){return new C(e.x,e.y,e.z,t)}toArray(){return[this.x,this.y,this.z,this.w]}static fromHexColor(e,t=1){e.startsWith("#")&&(e=e.slice(1));let l=parseInt(e,16),r=l>>16&255,o=l>>8&255,n=l&255;return new C(r/255*t,o/255*t,n/255*t,t)}toHexColor(){let e=t=>Math.floor(t*255).toString(16).padStart(2,"0");return`#${e(this.x)}${e(this.y)}${e(this.z)}${e(this.w)}`}toString(){return`Vec4(${Ae(this.x)}, ${Ae(this.y)}, ${Ae(this.z)}, ${Ae(this.w)})`}}function Ae(i,e=3){return parseFloat(i.toFixed(e)).toString()}class Lt{constructor(...e){this.min=new y,this.max=new y,this.empty=!0;for(let t of e)this.addInPlace(t)}addInPlace(e){return this.empty?(this.min.x=e.x,this.min.y=e.y,this.min.z=e.z,this.max.x=e.x,this.max.y=e.y,this.max.z=e.z,this.empty=!1):(this.min.x=Math.min(this.min.x,e.x),this.min.y=Math.min(this.min.y,e.y),this.min.z=Math.min(this.min.z,e.z),this.max.x=Math.max(this.max.x,e.x),this.max.y=Math.max(this.max.y,e.y),this.max.z=Math.max(this.max.z,e.z)),this}combineInPlace(e){return e.empty?this:this.addInPlace(e.min).addInPlace(e.max)}center(){let e=this.max,t=this.min;return new y(e.x+.5*(t.x-e.x),e.y+.5*(t.y-e.y),e.z+.5*(t.z-e.z))}size(){return this.max.sub(this.min)}contains(e){return!this.empty&&e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}intersects(e){return!this.empty&&!e.empty&&this.max.x>=e.min.x&&this.min.x<=e.max.x&&this.max.y>=e.min.y&&this.min.y<=e.max.y&&this.max.z>=e.min.z&&this.min.z<=e.max.z}expandInPlace(e){return this.empty||(this.min.x-=e,this.min.y-=e,this.min.z-=e,this.max.x+=e,this.max.y+=e,this.max.z+=e),this}shrinkInPlaceXY(e){return this.empty||(this.min.x+=e,this.min.y+=e,this.max.x-=e,this.max.y-=e,(this.min.x>this.max.x||this.min.y>this.max.y)&&(this.empty=!0,this.min=new y,this.max=new y)),this}clone(){let e=new Lt;return e.min=this.min.clone(),e.max=this.max.clone(),e.empty=this.empty,e}toString(){return`BoundingBox3d(${this.min}, ${this.max})`}}class ie{static add_(e,t,l,r,o,n){o[n+0]=e[t+0]+l[r+0],o[n+1]=e[t+1]+l[r+1],o[n+2]=e[t+2]+l[r+2]}static sub_(e,t,l,r,o,n){o[n+0]=e[t+0]-l[r+0],o[n+1]=e[t+1]-l[r+1],o[n+2]=e[t+2]-l[r+2]}static copy_(e,t,l,r){l[r+0]=e[t+0],l[r+1]=e[t+1],l[r+2]=e[t+2]}static normalize_(e,t,l,r){let o=e[t+0],n=e[t+1],s=e[t+2],a=1/Math.sqrt(o*o+n*n+s*s);l[r+0]=o*a,l[r+1]=n*a,l[r+2]=s*a}static len_(e,t){let l=e[t+0],r=e[t+1],o=e[t+2];return Math.sqrt(l*l+r*r+o*o)}}function ji(i,e){return new Array(i).fill(0)}function ze(i){return i==null}function Ke(i){return i!=null}function Oe(i,e,t){return i<e?e:i>t?t:i}function St(i){let e=window.atob(i),t=e.length,l=new Uint8Array(t);for(let r=0;r<t;r++)l[r]=e.charCodeAt(r);return l.buffer}function Hi(i,e){return Math.ceil(i/e)*e}function Gi(i){return{gl:i,vertShaders:new Map,fragShaders:new Map,programs:[],unlinkedPrograms:[]}}function W(i,e,t,l,r,o){"shaderManager"in i&&(i=i.shaderManager);let n=i.gl,s=n.createProgram();function a(x,v,d,p){let _=p.get(v);return _||(_=n.createShader(x),n.shaderSource(_,v),n.compileShader(_),p.set(v,_)),n.attachShader(s,_),_}let u=a(n.VERTEX_SHADER,t,"vert",i.vertShaders),f=a(n.FRAGMENT_SHADER,l,"frag",i.fragShaders),c={};if(r)for(let x of r)c[x]=-1;let m={name:e,program:s,vertSource:t,fragSource:l,vertShader:u,fragShader:f,locs:c,uboBindings:(o==null?void 0:o.uboBindings)??{},ready:!1};return i.unlinkedPrograms.push(m),m}function kt(i){var l;let e=i.gl;for(let r of i.unlinkedPrograms)e.linkProgram(r.program);for(let r of i.unlinkedPrograms){let o=r.program;if(e.getProgramParameter(o,e.LINK_STATUS)){for(let n of Object.keys(r.locs)){let s=e.getUniformLocation(o,n);s||console.log(`uniform of ${r.name} not found: ${n} (may just be unused)`),r.locs[n]=s}r.ready=!0;for(let n of Object.keys(r.uboBindings)){let s=e.getUniformBlockIndex(o,n);s<0&&console.log(`ubo of ${r.name} not found: ${n} (may just be unused)`),e.uniformBlockBinding(o,s,r.uboBindings[n])}}else{if(e.getProgramInfoLog(o)){let s=`---- '${r.name}' program info log ----`;console.log(`${s}
`+((l=e.getProgramInfoLog(o))==null?void 0:l.replace("\0","").trimEnd()))}t(r.vertShader,r.name,"vert"),t(r.fragShader,r.name,"frag")}}i.programs.push(...i.unlinkedPrograms),i.unlinkedPrograms=[];function t(r,o,n){let s=e.getShaderInfoLog(r);if(s){let a=`---- ${o} ${n} shader info log ----`;console.log(`${a}
`+s.replace("\0","").trimEnd())}}}function Be(i,e,t,l){i.bindBuffer(i.ARRAY_BUFFER,e);let r=t.locOffset||0,o=t.bufOffset||0,n=t.divisor||0,s=0;for(let a of l)s+=a.size*4*(a.nCols??1);for(let a of l)for(let u=0;u<(a.nCols??1);u++)i.enableVertexAttribArray(r),i.vertexAttribPointer(r,a.size,i.FLOAT,!1,s,o),i.vertexAttribDivisor(r,n),o+=a.size*4,r++;return s}function Ee(i,e,t,l,r,o){let n=(o==null?void 0:o.numPhases)||1;if(e===i.UNIFORM_BUFFER){let u=Math.max(i.getParameter(i.UNIFORM_BUFFER_OFFSET_ALIGNMENT)??0,64);r=Hi(r,u)}let s=r/4;i.bindBuffer(e,t),i.bufferData(e,l*r,i.DYNAMIC_DRAW);let a=[];for(let u=0;u<n;u++)a.push({buf:new Float32Array(l*s),strideFloats:s,strideBytes:r,capacityEls:l,usedEls:0,glOffsetEls:0});return{target:e,buf:t,strideFloats:s,strideBytes:r,glCapacityEls:l,localBufs:a}}function ye(i,e){let t=i.usedEls+e;if(t>i.capacityEls){for(;t>i.capacityEls;)i.capacityEls*=2;let l=new Float32Array(i.capacityEls*i.strideFloats);l.set(i.buf),i.buf=l}}function Re(i,e){i.bindBuffer(e.target,e.buf);let t=0;for(let r=0;r<e.localBufs.length;r++){let o=e.localBufs[r];t+=o.usedEls}if(t>e.glCapacityEls){for(;t>e.glCapacityEls;)e.glCapacityEls*=2;i.bufferData(e.target,e.glCapacityEls*e.strideBytes,i.DYNAMIC_DRAW)}let l=0;for(let r=0;r<e.localBufs.length;r++){let o=e.localBufs[r];o.glOffsetEls=l,o.usedEls>0&&i.bufferSubData(e.target,l*e.strideBytes,o.buf.subarray(0,o.usedEls*o.strideFloats)),l+=o.usedEls}}function Me(i){for(let e=0;e<i.localBufs.length;e++)i.localBufs[e].usedEls=0}function ni(i,e,t,l){let r=(l==null?void 0:l.numPhases)||1;i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e),i.bufferData(i.ELEMENT_ARRAY_BUFFER,t*4,i.DYNAMIC_DRAW);let o=[];for(let n=0;n<r;n++)o.push({buf:new Uint32Array(t),capacityVerts:t,usedVerts:0,glOffsetBytes:0});return{buf:e,glCapacityVerts:t,localBufs:o}}function Ne(i,e){let t=i.usedVerts+e;if(t>i.capacityVerts){let l=i.capacityVerts*2;for(;t>l;)l*=2;let r=new Uint32Array(l);r.set(i.buf),i.capacityVerts=l,i.buf=r}}function si(i,e){i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.buf);let t=0;for(let r=0;r<e.localBufs.length;r++){let o=e.localBufs[r];t+=o.usedVerts}if(t>e.glCapacityVerts){for(;t>e.glCapacityVerts;)e.glCapacityVerts*=2;i.bufferData(i.ELEMENT_ARRAY_BUFFER,e.glCapacityVerts*4,i.DYNAMIC_DRAW)}let l=0;for(let r=0;r<e.localBufs.length;r++){let o=e.localBufs[r];o.glOffsetBytes=l*4;let n=o.buf.subarray(0,o.usedVerts);o.usedVerts>0&&i.bufferSubData(i.ELEMENT_ARRAY_BUFFER,l*4,n),l+=o.usedVerts}}function ai(i){for(let e=0;e<i.localBufs.length;e++)i.localBufs[e].usedVerts=0}function Qi(i,e,t){return Zi(i.ctx.shaderManager,e.model,t)}const J=`#version 300 es
precision highp float;
layout(location = 0) in vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0, 1);
}
`;function Zi(i,e,t){let l=i.gl,r="transformer",o=e.config,n=o.n_embd,s=o.n_head,a=o.block_size,u=o.n_layer,f=o.vocab_size,c=n/s,m={B:t,C:n,nHeads:s,T:a,A:c,nBlocks:u,vocabSize:f},x={gl:l,model:e,shape:m,shaderManager:i},v=new Float32Array(t*a),d=N(l,1,t*a,1),p=new Float32Array(t*a);for(let U=0;U<t;U++)for(let I=0;I<a;I++)p[U*a+I]=I;let _=N(l,1,t*a,1);ce(l,_,p);let b=ci(x,r+".wte",f,n,d),h=ci(x,r+".wpe",a,n,_),g=Ut(x,b.output,h.output),A=[],z=g.output;for(let U=0;U<u;U++){let I=Ji(x,r+".h."+U,z);A.push(I),z=I.output}let F=Dt(x,r+".ln_f",z),R=et(x,"lm_head",n,f,F.output,void 0,!1),L=tl(x,R.output),q=il(x,L.output,d);return kt(i),{gl:l,inputBuf:v,inputTokens:d,vocabEmbed:b,posEmbed:h,add:g,blocks:A,ln_f:F,lm_head:R,shape:m,softmaxFinal:L,copyOutputToInput:q,output:L.output,inputLen:6,resultBuf:null,sortedBuf:null,readbackSync:null}}function Ji(i,e,t){let l=Dt(i,e+".ln_1",t),r=Ki(i,e+".attn",l.output,t),o=Dt(i,e+".ln_2",r.output),n=el(i,e+".mlp",o.output,r.output);return{attn:r,ln_1:l,ln_2:o,mlp:n,output:n.output}}function Ki(i,e,t,l){let{gl:r,model:o,shape:{B:n,T:s,C:a,nHeads:u,A:f},shaderManager:c}=i,m=o[e+".c_attn.weight"].view([3,u,f,a]).permute(1,2,3,0),x=o[e+".c_attn.bias"].view([3,u,f]).permute(1,2,0),v=N(r,a,u*f,3),d=N(r,1,u*f,3),p=N(r,f,n*u*s,4),_=N(r,s,n*u*s,1),b=N(r,1,n*u*s,2),h=N(r,s,n*u*s,1),g=N(r,u*f,n*s,1);ce(r,v,m.toFloat32Array()),ce(r,d,x.toFloat32Array());let A=W(c,"qkv",J,`#version 300 es
        precision highp float;
        uniform sampler2D attnInput; // (B, T)         (C)
        uniform sampler2D qkvWeight; // (nHeads, A)    (C) [3]
        uniform sampler2D qkvBias;   // (nHeads, A)    (1) [3]
        out vec4 qkvOutput;          // (B, nHeads, T) (A)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int headIdx = pos.y / ${s};
            int tIdx = pos.y % ${s};
            int bIdx = headIdx / ${u};
            headIdx = headIdx % ${u};

            vec3 a = texelFetch(qkvBias, ivec2(0, headIdx * ${f} + pos.x), 0).rgb;
            for (int i = 0; i < ${a}; i++) {
                float inVal = texelFetch(attnInput, ivec2(i, tIdx + bIdx * ${s}    ), 0).r;
                vec3 qkvW   = texelFetch(qkvWeight,  ivec2(i, headIdx * ${f} + pos.x), 0).rgb;
                a += inVal * qkvW;
            }

            qkvOutput = vec4(a, 1);
        }
    `),z=W(c,"selfAttend",J,`#version 300 es
        precision highp float;
        uniform sampler2D qkvOutput; // (B, nHeads, T) (A)
        out float attnMatrix;        // (B, nHeads, T) (T)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxK = pos.x;
            int tIdxQ = pos.y % ${s};
            int yOffset = pos.y - tIdxQ;

            if (tIdxK > tIdxQ) { // # forward attention only
                discard;
            }

            float a = 0.0;
            for (int i = 0; i < ${f}; i++) {
                float q = texelFetch(qkvOutput, ivec2(i, yOffset + tIdxQ), 0).r;
                float k = texelFetch(qkvOutput, ivec2(i, yOffset + tIdxK), 0).g;
                a += q * k;
            }

            attnMatrix = a / sqrt(float(${f}));
        }
    `),F=W(c,"attnMatrixAgg",J,`#version 300 es
        precision highp float;
        uniform sampler2D attnMatrix; // (B, nHeads, T) (T)
        out vec2 attnMatrixAgg;       // (B, nHeads, T) (1) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxY = pos.y % ${s};

            // Pass 1 finds the max
            float m = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float p = texelFetch(attnMatrix, ivec2(i, pos.y), 0).r;
                m = max(m, p);
            }

            // Pass 2 finds the exp sum (shifted by max)
            float a = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float p = texelFetch(attnMatrix, ivec2(i, pos.y), 0).r;
                a += exp(p - m);
            }

            // Store sufficient information to compute/apply the softmax
            attnMatrixAgg = vec2(1.0 / a, m);
        }
    `),R=W(c,"attnMatrixSoftmax",J,`#version 300 es
        precision highp float;
        uniform sampler2D attnMatrix;    // (B, nHeads, T) (T)
        uniform sampler2D attnMatrixAgg; // (B, nHeads, T) (1) [2]
        out float attnMatrixSoftmax;     // (B, nHeads, T) (T)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxX = pos.x;
            int tIdxY = pos.y % ${s};

            if (tIdxX > tIdxY) { // # forward attention only
                attnMatrixSoftmax = 0.0;
                discard;
            }

            vec2 agg = texelFetch(attnMatrixAgg, ivec2(0, pos.y), 0).rg;
            float expSumInv = agg.r;
            float maxVal = agg.g;

            float p = texelFetch(attnMatrix, pos, 0).r;
            attnMatrixSoftmax = exp(p - maxVal) * expSumInv;
        }
    `),L=W(c,"scaledVectors",J,`#version 300 es
        precision highp float;
        uniform sampler2D qkvOutput;         // (B, nHeads, T) (A)
        uniform sampler2D attnMatrixSoftmax; // (B, nHeads, T) (T)
        out float scaledVectors;             // (B, T)         (A * nHeads)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int aIdx = pos.x % ${f};
            int headIdx = pos.x / ${f};

            int tIdxY = pos.y % ${s};
            int bIdx = pos.y / ${s};

            int yOffset = bIdx * ${s} * ${u} + headIdx * ${s};

            float res = 0.0;
            for (int i = 0; i <= tIdxY; i++) {
                float sm = texelFetch(attnMatrixSoftmax, ivec2(i, yOffset + tIdxY), 0).r;
                float v = texelFetch(qkvOutput, ivec2(aIdx, yOffset + i), 0).b;
                res += sm * v;
            }

            scaledVectors = res;
        }
    `);if(!A||!z||!F||!R||!L)throw new Error("Failed to create shader program");let q=Z(r,A,[p],[t,v,d],["attnInput","qkvWeight","qkvBias"]),U=Z(r,z,[_],[p],["qkvOutput"]),I=Z(r,F,[b],[_],["attnMatrix"]),j=Z(r,R,[h],[_,b],["attnMatrix","attnMatrixAgg"]),K=Z(r,L,[g],[p,h],["qkvOutput","attnMatrixSoftmax"]),oe=et(i,e+".c_proj",a,a,g),S=Ut(i,oe.output,l);return{qkvWeight:v,qkvBias:d,qkvOutput:p,attnMatrix:_,attnMatrixAgg:b,attnMatrixSoftmax:h,scaledVectors:g,qkvPhase:q,selfAttendPhase:U,attnMatrixAggPhase:I,attnMatrixSoftmaxPhase:j,scaledVectorsPhase:K,proj:oe,add:S,output:S.output}}function el(i,e,t,l){let{gl:r,shape:{B:o,T:n,C:s},shaderManager:a}=i,u=N(r,s*4,o*n,1),f=W(a,"mlpGelu",J,`#version 300 es
        precision highp float;
        uniform sampler2D geluInput;  // (B, T) (C * 4)
        out float geluOutput; // (B, T) (C * 4)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            float x = texelFetch(geluInput, pos, 0).r;
            geluOutput = x * 0.5 * (1.0 + tanh(sqrt(2.0 / 3.14159265358) * (x + 0.044715 * x * x * x)));
        }
    `),c=et(i,e+".c_fc",s,s*4,t),m=Z(r,f,[u],[c.output],["geluInput"]),x=et(i,e+".c_proj",s*4,s,u),v=Ut(i,x.output,l);return{fcLayer:c,mlpGelu:u,geluPhase:m,projLayer:x,addLayer:v,output:v.output}}function Dt(i,e,t){let{gl:l,model:r,shape:{B:o,T:n,C:s},shaderManager:a}=i,u=r[e+".weight"],f=r[e+".bias"],c=N(l,1,s,1),m=N(l,1,s,1),x=N(l,1,o*n,2),v=N(l,s,o*n,1);ce(l,c,u.toFloat32Array()),ce(l,m,f.toFloat32Array());let p=W(a,"normAgg",J,`#version 300 es
        precision highp float;
        uniform sampler2D normInput; // (B, T) (C)
        out vec2 normAgg;            // (B, T) (1) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            // Use Welford's algorithm to compute mean and variance
            float mean = 0.0;
            float M2 = 0.0;
            for (int i = 0; i < ${s}; i++) {
                float x = texelFetch(normInput, ivec2(i, pos.y), 0).r;
                float delta = x - mean;
                mean += delta / float(i + 1);
                M2 += delta * (x - mean);
            }

            normAgg = vec2(mean, 1.0 / sqrt(M2 / float(${s}) + ${1e-5}));
        }
    `),_=W(a,"normApply",J,`#version 300 es
        precision highp float;
        uniform sampler2D normInput;  // (B, T) (C)
        uniform sampler2D normAgg;    // (B, T) (1) [2]
        uniform sampler2D normWeight; // (C)    (1)
        uniform sampler2D normBias;   // (C)    (1)
        out float normOutput;         // (B, T) (C)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            vec2 agg = texelFetch(normAgg, ivec2(0, pos.y), 0).rg;
            float mean = agg.r;
            float stdInv = agg.g;

            float x = texelFetch(normInput, pos, 0).r;

            float weight = texelFetch(normWeight, ivec2(0, pos.x), 0).r;
            float bias   = texelFetch(normBias,   ivec2(0, pos.x), 0).r;

            normOutput = (x - mean) * stdInv * weight + bias;
        }
    `),b=Z(l,p,[x],[t],["normInput"]),h=Z(l,_,[v],[t,x,c,m],["normInput","normAgg","normWeight","normBias"]);return{normAgg:x,normWeight:c,normBias:m,aggPhase:b,applyPhase:h,output:v}}function et(i,e,t,l,r,o,n){let{gl:s,model:a,shape:{B:u,T:f},shaderManager:c}=i;n=n??!0;let m=a[e+".weight"],x=n?a[e+".bias"]:null,v=N(s,t,l,1),d=n?N(s,1,l,1):null,p=N(s,l,u*f,1);ce(s,v,m.buffer),x&&d&&ce(s,d,x.buffer);let _=W(c,"linear",J,`#version 300 es
        precision highp float;          //    y     x
        uniform sampler2D linearInput;  // (B, T) (nIn)
        uniform sampler2D linearWeight; // (nOut) (nIn)
        ${n?"uniform sampler2D linearBias;":""}   // (nOut) (1)
        
        out float linearOutput;         // (B, T) (nOut)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            float res = ${n?"texelFetch(linearBias, ivec2(0, pos.x), 0).r":"0.0"};
            for (int i = 0; i < ${t}; i++) {
                float x = texelFetch(linearInput, ivec2(i, pos.y), 0).r;
                float w = texelFetch(linearWeight, ivec2(i, pos.x), 0).r;
                res += x * w;
            }

            
            linearOutput = res;
        }
    `),b=Z(s,_,[p],[r,v,d,o].filter(ri),["linearInput","linearWeight",n?"linearBias":null,null].filter(ri));return{weight:v,bias:d,linearPhase:b,output:p}}function ci(i,e,t,l,r){let{gl:o,model:n,shape:{B:s,T:a},shaderManager:u}=i,f=n[e+".weight"],c=N(o,l,t,1),m=N(o,l,s*a,1);ce(o,c,f.buffer);let x=W(u,"embed",J,`#version 300 es
        precision highp float;          //    y     x
        uniform sampler2D embedInput;  // (B, T)   (1)
        uniform sampler2D embedWeight; // (nEmbed) (nDims)
        out float embedOutput;         // (B, T)   (nDims)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int y = int(texelFetch(embedInput, ivec2(0, pos.y), 0).r);
            float res = texelFetch(embedWeight, ivec2(pos.x, y), 0).r;

            embedOutput = res;
        }
    `),v=Z(o,x,[m],[r,c],["embedInput","embedWeight"]);return{weight:c,phase:v,output:m}}function Ut(i,e,t){let{gl:l,shape:{B:r,T:o,C:n},shaderManager:s}=i,a=N(l,n,r*o,1),u=W(s,"add",J,`#version 300 es
        precision highp float;     //    y    x
        uniform sampler2D inputA;  // (B, T) (C)
        uniform sampler2D inputB;  // (B, T) (C)
        out float addOutput;       // (B, T) (C)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            float a = texelFetch(inputA, pos, 0).r;
            float b = texelFetch(inputB, pos, 0).r;
            addOutput = a + b;
        }
    `);return{addPhase:Z(l,u,[a],[e,t],["inputA","inputB"]),output:a}}function tl(i,e){let{gl:t,shape:{B:l,T:r,C:o,vocabSize:n},shaderManager:s}=i,a=N(t,1,l*r,2),u=N(t,n,l*r,1),f=W(s,"softmaxAgg",J,`#version 300 es
        precision highp float;       //    y      x
        uniform sampler2D smInput;   // (B, T) (nVocab)
        out vec2 smAgg;              // (B)    (nVocab) [2]

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxY = pos.y % ${r};

            // Pass 1 finds the max
            float m = 0.0;
            for (int i = 0; i < ${n}; i++) {
                float p = texelFetch(smInput, ivec2(i, pos.y), 0).r;
                m = max(m, p);
            }

            // Pass 2 finds the exp sum (shifted by max)
            float a = 0.0;
            for (int i = 0; i < ${n}; i++) {
                float p = texelFetch(smInput, ivec2(i, pos.y), 0).r;
                a += exp(p - m);
            }

            // Store sufficient information to compute/apply the softmax
            smAgg = vec2(1.0 / a, m);
        }
    `),c=W(s,"softmax",J,`#version 300 es
        precision highp float;
        uniform sampler2D smInput;    // (B, T) (nVocab)
        uniform sampler2D smAgg;      // (B)    (nVocab) [2]
        out float smOutput;           // (B, T) (nVocab)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);
            int tIdxX = pos.x;
            int tIdxY = pos.y % ${r};

            vec2 agg = texelFetch(smAgg, ivec2(0, pos.y), 0).rg;
            float expSumInv = agg.r;
            float maxVal = agg.g;

            float p = texelFetch(smInput, pos, 0).r;
            smOutput = exp(p - maxVal) * expSumInv;
        }
    `),m=Z(t,f,[a],[e],["smInput"]),x=Z(t,c,[u],[e,a],["smInput","smAgg"]);return{bufs:[a,u],progs:[f,c],phases:[m,x],agg:a,aggPhase:m,softmaxPhase:x,output:u}}function il(i,e,t){let{gl:l,shape:{T:r,vocabSize:o},shaderManager:n}=i,s=W(n,"copy",J,`#version 300 es
        precision highp float;         //    y    x
        uniform sampler2D prevOutput;  // (B, T) (n_vocab)
        uniform int u_targetTIdx;
        out float currInput;           // (B, T) (1)

        void main() {
            ivec2 pos = ivec2(gl_FragCoord.xy);

            int tIdx = pos.y % ${r};

            if (tIdx != u_targetTIdx) {
                discard;
            }

            int maxVocabI = 0;
            float maxVocabP = 0.0;
            for (int i = 0; i < ${o}; i++) {
                float p = texelFetch(prevOutput, ivec2(i, pos.y), 0).r;
                if (p > maxVocabP) {
                    maxVocabP = p;
                    maxVocabI = i;
                }
            }

            currInput = float(maxVocabI);
        }
    `);return{copyPhase:Z(l,s,[t],[e],["prevOutput"])}}const Y=class Y extends Float32Array{constructor(){super(16),this[0]=this[5]=this[10]=this[15]=1}g(e,t){return this[t*4+e]}s(e,t,l){this[t*4+e]=l}add(e){let t=new Y;for(let l=0;l<16;l++)t[l]=this[l]+e[l];return t}sub(e){let t=new Y;for(let l=0;l<16;l++)t[l]=this[l]-e[l];return t}mul(e){let t=new Y;for(let l=0;l<4;l++)for(let r=0;r<4;r++){let o=0;for(let n=0;n<4;n++)o+=this[n*4+r]*e[l*4+n];t[l*4+r]=o}return t}mulVec4(e){let t=this[0]*e.x+this[4]*e.y+this[8]*e.z+this[12]*e.w,l=this[1]*e.x+this[5]*e.y+this[9]*e.z+this[13]*e.w,r=this[2]*e.x+this[6]*e.y+this[10]*e.z+this[14]*e.w,o=this[3]*e.x+this[7]*e.y+this[11]*e.z+this[15]*e.w;return new C(t,l,r,o)}mulVec3Proj(e){let t=this.mulVec4(new C(e.x,e.y,e.z,1)),l=1/t.w;return new y(t.x*l,t.y*l,t.z*l)}mulVec3ProjVec(e){let t=this.mulVec4(new C(e.x,e.y,e.z,0));return new y(t.x,t.y,t.z)}mulVec3Affine(e){let t=new y;return this.mulVec3Affine_(e,t),t}mulVec3Affine_(e,t){let l=this[0]*e.x+this[4]*e.y+this[8]*e.z+this[12],r=this[1]*e.x+this[5]*e.y+this[9]*e.z+this[13],o=this[2]*e.x+this[6]*e.y+this[10]*e.z+this[14];t.x=l,t.y=r,t.z=o}mulVec3AffineArr_(e,t,l,r){let o=e[t],n=e[t+1],s=e[t+2];l[r+0]=this[0]*o+this[4]*n+this[8]*s+this[12],l[r+1]=this[1]*o+this[5]*n+this[9]*s+this[13],l[r+2]=this[2]*o+this[6]*n+this[10]*s+this[14]}mulVec3AffineVec_(e,t){let l=this[0]*e.x+this[4]*e.y+this[8]*e.z,r=this[1]*e.x+this[5]*e.y+this[9]*e.z,o=this[2]*e.x+this[6]*e.y+this[10]*e.z;t.x=l,t.y=r,t.z=o}static fromRowMajor(e){e.length>0&&Array.isArray(e[0])&&(e=e.flatMap(r=>r));let t=e;t.length!==16&&console.log("need 16 elements");let l=new Y;for(let r=0;r<4;r++)for(let o=0;o<4;o++)l[r*4+o]=t[o*4+r];return l}static fromColMajor(e,t=0){e.length-t<16&&console.log("need 16 elements");let l=new Y;for(let r=0;r<16;r++)l[r]=e[t+r];return l}static fromTranslation(e){let t=new Y;return t[12]=e.x,t[13]=e.y,t[14]=e.z,t}static fromScaleTranslation(e,t){let l=new Y;return l[0]=e.x,l[5]=e.y,l[10]=e.z,l[12]=t.x,l[13]=t.y,l[14]=t.z,l}static fromAxisAngle(e,t){let l=new Y;return rl(e,t,l,4),l}static fromQuat(e){let t=new Y;return ll(e,t,4),t}static fromScale(e){let t=new Y;return t[0]=e.x,t[5]=e.y,t[10]=e.z,t}static fromLookAt(e,t,l){let r=e.sub(t).normalize(),o=l.normalize(),n=y.cross(o,r).normalize();o=y.cross(r,n);let s=new Y;return s[0]=n.x,s[1]=o.x,s[2]=r.x,s[4]=n.y,s[5]=o.y,s[6]=r.y,s[8]=n.z,s[9]=o.z,s[10]=r.z,s[12]=-e.dot(n),s[13]=-e.dot(o),s[14]=-e.dot(r),s}static fromPersp(e,t,l,r){let o=l*Math.tan(e/2*Math.PI/180)*2,n=o*t,s=new Y;return s[0]=2*l/n,s[5]=2*l/o,s[10]=-r/(r-l),s[11]=-1,s[14]=-r*l/(r-l),s[15]=0,s}static fromOrtho(e,t,l,r,o,n){let s=new Y;return s[0]=2/(t-e),s[5]=2/(r-l),s[10]=-2/(n-o),s[12]=-(t+e)/(t-e),s[13]=-(r+l)/(r-l),s[14]=-(n+o)/(n-o),s}static zeros(){let e=new Y;return e[0]=0,e[5]=0,e[10]=0,e[15]=0,e}decomposeToTRS(){let e=y.fromArray(this,12),t=new y(y.fromArray(this,0).len(),y.fromArray(this,4).len(),y.fromArray(this,8).len()),l=this[0]+this[5]+this[10],r;if(l>0){let o=Math.sqrt(1+l),n=.5/o;r=new C((this[6]-this[9])*n,(this[8]-this[2])*n,(this[1]-this[4])*n,.5*o)}else if(this[0]>this[5]&&this[0]>this[10]){let o=Math.sqrt(1+this[0]-this[5]-this[10]),n=.5/o;r=new C(.5*o,(this[1]+this[4])*n,(this[8]+this[2])*n,(this[6]-this[9])*n)}else if(this[5]>this[10]){let o=Math.sqrt(1+this[5]-this[0]-this[10]),n=.5/o;r=new C((this[4]+this[1])*n,.5*o,(this[9]+this[6])*n,(this[8]-this[2])*n)}else{let o=Math.sqrt(1+this[10]-this[0]-this[5]),n=.5/o;r=new C((this[8]+this[2])*n,(this[9]+this[6])*n,.5*o,(this[1]-this[4])*n)}return[e,r,t]}invertTRS(){let e=new Y,t=y.fromArray(this,0),l=y.fromArray(this,4),r=y.fromArray(this,8),o=y.fromArray(this,12);return e[0]=this[0],e[1]=this[4],e[2]=this[8],e[4]=this[1],e[5]=this[5],e[6]=this[9],e[8]=this[2],e[9]=this[6],e[10]=this[10],e[12]=-t.dot(o),e[13]=-l.dot(o),e[14]=-r.dot(o),e}determinant(){let e=new Float64Array(this),t=new Int32Array(5);return ui(e,t,4),nl(e,t,4)}invert(){let e=new Float64Array(this),t=new Int32Array(5);ui(e,t,4);let l=new Y;return ol(e,t,4,l),l}toString(){let e=`
`;for(let t=0;t<4;t++){e+=t===0?"[[":" [";for(let l=0;l<4;l++){let r=this.g(t,l);e+=(r<0?"":" ")+r.toFixed(3)+(l===3?"]":", ")}e+=t===3?"]":`
`}return e}};Y.identity=new Y;let D=Y;function ll(i,e,t){let l=i.lenSq(),r=l===0?0:2/l,o=i.x,n=i.y,s=i.z,a=i.w,u=0;e[u+0]=1-r*(n*n+s*s),e[u+1]=r*(o*n+a*s),e[u+2]=r*(o*s-a*n),u=t,e[u+0]=r*(o*n-a*s),e[u+1]=1-r*(o*o+s*s),e[u+2]=r*(n*s+a*o),u=t*2,e[u+0]=r*(o*s+a*n),e[u+1]=r*(n*s-a*o),e[u+2]=1-r*(o*o+n*n)}function rl(i,e,t,l){let r=i.normalize(),o=Math.cos(e),n=Math.sin(e),s=r.x,a=r.y,u=r.z,f=1-o,c=0;t[c+0]=s*s*f+o,t[c+1]=a*s*f+u*n,t[c+2]=u*s*f-a*n,c=l,t[c+0]=s*a*f-u*n,t[c+1]=a*a*f+o,t[c+2]=u*a*f+s*n,c=l*2,t[c+0]=s*u*f+a*n,t[c+1]=a*u*f-s*n,t[c+2]=u*u*f+o}function ui(i,e,t){for(let l=0;l<=t;l++)e[l]=l;for(let l=0;l<t;l++){let r=0,o=l;for(let n=l;n<t;n++){let s=Math.abs(i[n*t+l]);s>r&&(r=s,o=n)}if(r<1e-9)return!1;if(o!==l){let n=e[l];e[l]=e[o],e[o]=n;for(let s=0;s<t;s++){let a=i[l*t+s];i[l*t+s]=i[o*t+s],i[o*t+s]=a}e[t]+=1}for(let n=l+1;n<t;n++){i[n*t+l]/=i[l*t+l];for(let s=l+1;s<t;s++)i[n*t+s]-=i[n*t+l]*i[l*t+s]}}}function ol(i,e,t,l){for(let r=0;r<t;r++){for(let o=0;o<t;o++){l[o*t+r]=e[o]===r?1:0;for(let n=0;n<o;n++)l[o*t+r]-=i[o*t+n]*l[n*t+r]}for(let o=t-1;o>=0;o--){for(let n=o+1;n<t;n++)l[o*t+r]-=i[o*t+n]*l[n*t+r];l[o*t+r]/=i[o*t+o]}}}function nl(i,e,t){let l=i[0];for(let r=1;r<t;r++)l*=i[r*t+r];return e[t]-t&1?-l:l}const Q={ModelView:0,Block:1,BlockAccess:2,blur:3};var ee=(i=>(i[i.Opaque=0]="Opaque",i[i.Arrows=1]="Arrows",i[i.Overlay=2]="Overlay",i[i.Overlay2D=3]="Overlay2D",i))(ee||{});const sl=4;function al(i){let e=i.gl,t=e.createBuffer();e.bindBuffer(e.UNIFORM_BUFFER,t),e.bufferData(e.UNIFORM_BUFFER,128,e.DYNAMIC_DRAW),e.bindBufferBase(e.UNIFORM_BUFFER,Q.ModelView,t);let l=new Float32Array(32);return{gl:e,modelViewUbo:t,modelViewBuf:l,activePhase:0,numPhases:sl}}function tt(i,e,t){let{gl:l,modelViewUbo:r,modelViewBuf:o}=i;o.set(e,0),o.set(t,16),l.bindBuffer(l.UNIFORM_BUFFER,r),l.bufferSubData(l.UNIFORM_BUFFER,0,o)}const Te=`
    layout(std140) uniform ModelViewUbo {
        uniform mat4 u_model;
        uniform mat4 u_view;
    };`,ue=20,fi=5,cl=fi*4,Xt=1024;function mi(i,e){let t=i?i.replace(/\/$/,""):"",l=e.replace(/^\//,"");return t?`${t}/${l}`:`/${l}`}async function ul(i=""){let e=document.createElement("img"),t=new Promise((n,s)=>{e.onload=()=>n(e),e.onerror=()=>s()});e.src=mi(i,"fonts/font-atlas.png");let l=fetch(mi(i,"fonts/font-def.json")).then(n=>n.json()),[r,o]=await Promise.all([t,l]);return{fontAtlasImage:r,fontDef:o}}function fl(i,e){let t=i.gl,l=e.fontDef,r=t.createTexture();t.bindTexture(t.TEXTURE_2D,r),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,t.RGBA,t.UNSIGNED_BYTE,e.fontAtlasImage);let o=W(i.shaderManager,"font",`#version 300 es
        precision highp float;
        ${Te}
        uniform sampler2D u_transformTex;
        layout (location = 0) in vec2 a_position;
        layout (location = 1) in vec2 a_uv;
        layout (location = 2) in float a_textId;
        out vec2 v_uv;
        out vec4 v_fgColor;
        out vec4 v_bgColor;

        void main() {
            int texWidth = textureSize(u_transformTex, 0).x;
            int texOffset = int(a_textId) * ${ue/4};
            int y = texOffset / texWidth;
            int x = texOffset % texWidth;
            vec4 t0 = texelFetch(u_transformTex, ivec2(x + 0, y), 0);
            vec4 t1 = texelFetch(u_transformTex, ivec2(x + 1, y), 0);
            vec4 t2 = texelFetch(u_transformTex, ivec2(x + 2, y), 0);
            vec4 t3 = texelFetch(u_transformTex, ivec2(x + 3, y), 0);
            vec4 c = texelFetch(u_transformTex, ivec2(x + 4, y), 0);
            mat4 transform = mat4(t0, t1, t2, t3);

            gl_Position = u_view * u_model * transform * vec4(a_position, 0.0, 1.0);
            v_uv = a_uv;
            v_fgColor = c;
            v_bgColor = vec4(0, 0, 0, 0);
        }

    `,`#version 300 es
        precision highp float;
        uniform sampler2D u_tex;
        uniform float pxRange; // set to distance field's pixel range
        in vec2 v_uv;
        in vec4 v_fgColor;
        in vec4 v_bgColor;
        out vec4 color;

        float median(float r, float g, float b) {
            return max(min(r, g), min(max(r, g), b));
        }

        float screenPxRange() {
            vec2 unitRange = vec2(pxRange) / vec2(textureSize(u_tex, 0));
            vec2 screenTexSize = vec2(1.0) / fwidth(v_uv);
            return max(0.5*dot(unitRange, screenTexSize), 1.0);
        }

        void main() {
            vec3 msd = texture(u_tex, v_uv).rgb;
            float sd = median(msd.r, msd.g, msd.b);
            float screenRange = screenPxRange();
            float screenPxDistance = screenRange*(sd - 0.5);
            float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

            float blurOpacity = 0.0; //smoothstep(0.5 - 0.4, 0.5, sd);

            if (opacity == 0.0 && blurOpacity == 0.0) {
                discard;
            }
            color = mix(vec4(0,0,0,1.0) * blurOpacity, v_fgColor, opacity);
        }
    `,["u_tex","u_transformTex","pxRange"],{uboBindings:{ModelViewUbo:Q.ModelView}});kt(i.shaderManager);let n=o.locs;t.useProgram(o.program),t.uniform1i(n.u_tex,0),t.uniform1i(n.u_transformTex,1);let s=[];for(let a of l.faces){let u=new Int16Array(St(a.chars)),f=12,c=u.length/f,m=new Map,x=new Map;for(let b=0;b<c;b++){let h=b*f,g={id:u[h+0],index:u[h+1],char:String.fromCharCode(u[h+2]),x:u[h+3],y:u[h+4],width:u[h+5],height:u[h+6],xoffset:u[h+7],yoffset:u[h+8],xadvance:u[h+9],page:u[h+10],chnl:u[h+11]};m.set(g.char,g),x.set(g.id,g)}let v=new Int16Array(St(a.kernings)),d=3,p=v.length/d,_=new Map;for(let b=0;b<p;b++){let h=b*d,g={first:v[h+0],second:v[h+1],amount:v[h+2]},A=x.get(g.first).char,z=x.get(g.second).char;_.set(`${A}${z}`,g.amount)}s.push({name:a.name,common:a.common,charMap:m,kernMap:_})}return{gl:t,faceInfos:s,program:o,atlasTex:r}}function ml(i,e){let t=i.gl,l=1024,r=1024,o=t.createTexture();t.bindTexture(t.TEXTURE_2D,o),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,Xt,dl(l),0,t.RGBA,t.FLOAT,null);let n=t.createVertexArray();t.bindVertexArray(n);let s=t.createBuffer();Be(t,s,{},[{name:"a_pos",size:2},{name:"a_uv",size:2},{name:"a_texIndex",size:1}]);let a=Ee(t,t.ARRAY_BUFFER,s,r,cl,e),u=new Float32Array(l*ue);return{atlas:i,vao:n,transformTex:o,vertBuffer:a,localTexBuffer:u,segmentsUsed:0,segmentCapacity:1024,glSegmentCapacity:1024,sharedRender:e}}function dl(i){return Math.ceil(i*ue/4/Xt)}let di=1.04;function hi(i,e,t=1,l){let r=i.atlas.faceInfos[0],o=0,n="";for(let s of e){let a=r.charMap.get(s);if(!a)continue;let u=`${n}${s}`,f=r.kernMap.get(u)||0;o+=f+a.xadvance,n=s}return o*t/r.common.lineHeight*di}function xi(i,e,t,l,r,o,n,s){let a=i.atlas.faceInfos[0];a||(a=i.atlas.faceInfos[0]);let u=i.sharedRender.activePhase,f=i.vertBuffer.localBufs[u];ye(f,e.length*fi),i.segmentsUsed===Math.floor(Xt*4/ue)&&(i.segmentsUsed+=1);let c=i.segmentsUsed,m=f.buf,x=f.usedEls*i.vertBuffer.strideFloats,v=1/a.common.scaleW,d=1/a.common.scaleH,p=0,_=l??0,b=r??0,h="";o=o??1;let g=o/a.common.lineHeight*di;for(let A of e){let z=a.charMap.get(A);if(!z)continue;let F=`${h}${A}`,R=a.kernMap.get(F)||0;_+=R*g;let L=[z.x*v,(z.x+z.width)*v],q=[z.y*d,(z.y+z.height)*d],U=[_+z.xoffset*g,_+(z.xoffset+z.width)*g],I=[b+z.yoffset*g,b+(z.yoffset+z.height)*g],j=[0,1,0,0,1,1,1,1,0,0,1,0];for(let K=0;K<6;K++){let oe=j[K*2],S=j[K*2+1];m[x++]=U[oe],m[x++]=I[S],m[x++]=L[oe],m[x++]=q[S],m[x++]=c}_+=z.xadvance*g,h=A,p+=1}if(f.usedEls+=p*6,n=n??new D,t=t??new C(1,1,1,1),i.segmentsUsed>=i.segmentCapacity){let A=i.segmentCapacity*2,z=new Float32Array(A*ue);z.set(i.localTexBuffer),i.localTexBuffer=z}i.localTexBuffer.set(n,i.segmentsUsed*ue+0),i.localTexBuffer.set(t.toArray(),i.segmentsUsed*ue+16),i.segmentsUsed+=1}function hl(i){let t=i.atlas.gl;if(t.bindTexture(t.TEXTURE_2D,i.transformTex),i.segmentCapacity>i.glSegmentCapacity){let l=1024,r=Math.ceil(i.segmentCapacity*ue/4/l);t.texImage2D(t.TEXTURE_2D,0,t.RGBA32F,l,r,0,t.RGBA,t.FLOAT,null),i.glSegmentCapacity=l*r/4}{let l=1024,r=Math.ceil(i.segmentsUsed*ue/4/l);t.texSubImage2D(t.TEXTURE_2D,0,0,0,l,r,t.RGBA,t.FLOAT,i.localTexBuffer)}Re(t,i.vertBuffer)}function xl(i,e){let t=i.atlas,l=t.gl;l.disable(l.CULL_FACE),l.depthMask(!1),l.useProgram(t.program.program);let r=t.program.locs;l.uniform1f(r.pxRange,4),l.activeTexture(l.TEXTURE0),l.bindTexture(l.TEXTURE_2D,t.atlasTex),l.activeTexture(l.TEXTURE1),l.bindTexture(l.TEXTURE_2D,i.transformTex),l.bindVertexArray(i.vao);let o=i.vertBuffer.localBufs[e];l.drawArrays(l.TRIANGLES,o.glOffsetEls,o.usedEls),l.depthMask(!0)}function vl(i){Me(i.vertBuffer),i.segmentsUsed=0}function pl(i){for(var e=0,t=1779033703^i.length;e<i.length;e++)t=Math.imul(t^i.charCodeAt(e),3432918353),t=t<<13|t>>>19;return function(){return t=Math.imul(t^t>>>16,2246822507),t=Math.imul(t^t>>>13,3266489909),(t^=t>>>16)>>>0}}function yl(i,e,t,l){return function(){i>>>=0,e>>>=0,t>>>=0,l>>>=0;var r=i+e|0;return i=e^e>>>9,e=t+(t<<3)|0,t=t<<21|t>>>11,l=l+1|0,r=r+l|0,t=t+r|0,(r>>>0)/4294967296}}function gl(i){let e=pl(i??Math.random().toString());return yl(e(),e(),e(),e())}class _l{constructor(e){this.normal=()=>{let t=this.random(),l=this.random();return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*l)},this.random=gl(e==null?void 0:e.toString())}randint(e,t){return Oe(Math.floor(this.random()*(t-e)+e),e,t-1)}}class ge{constructor(e,t,l=[]){this.shape=e,this.buffer=t,this.stride=l;let r=e.reduce((s,a)=>s*a,1);if(r>t.length)throw new Error(`Shape ${e.join(", ")} requires ${r} buffer, but buffer has size ${t.length}`);let o=new Array(e.length),n=1;for(let s=e.length-1;s>=0;s--)o[s]=n,n*=e[s];if(l.length===0)this.stride=o;else if(l.length!==e.length)throw new Error(`Stride length ${l.length} does not match shape length ${e.length}`);this.isContiguous=!0;for(let s=0;s<l.length;s++)if(l[s]!==o[s]){this.isContiguous=!1;break}}view(e){let t=e.reduce((r,o)=>r*o,1),l=this.shape.reduce((r,o)=>r*o,1);if(t!==l)throw new Error(`Invalid reshape: new size ${t} (${e.join(", ")}) does not match existing size ${l} (${this.shape.join(", ")})`);if(!this.isContiguous)throw new Error("Cannot view non-contiguous tensor (or at least, there are potential cases where it would work, but we don't support them yet)");return new ge(e,this.buffer)}transpose(e,t){if(e<0||e>=this.shape.length||t<0||t>=this.shape.length||e===t)throw new Error(`Invalid transpose indices: ${e}, ${t} over shape ${this.shape.join(", ")}`);let l=[...this.shape],r=[...this.stride],o=l[e];l[e]=l[t],l[t]=o;let n=r[e];return r[e]=r[t],r[t]=n,new ge(l,this.buffer,r)}permute(...e){let t=new Set(new Array(this.shape.length).fill(0).map((o,n)=>n));if(e.forEach(o=>t.delete(o)),e.length!==this.shape.length||t.size!==0)throw new Error(`Invalid permute axes: ${e.join(", ")} over shape ${this.shape.join(", ")}`);let l=e.map(o=>this.shape[o]),r=e.map(o=>this.stride[o]);return new ge(l,this.buffer,r)}g(e){return this.buffer[this.indexToOffset(e)]}s(e,t){this.buffer[this.indexToOffset(e)]=t}indexToOffset(e){if(e.length!==this.shape.length)throw new Error(`Index length ${e.length} does not match shape length ${this.shape.length}`);let t=0;for(let l=0;l<e.length;l++){if(e[l]>=this.shape[l])throw new Error(`Index ${e[l]} out of bounds for shape ${this.shape[l]}`);t+=e[l]*this.stride[l]}return t}*indexIterator(){let e=new Array(this.shape.length).fill(0);for(;;){yield e;let t=this.shape.length-1;for(;t>=0&&(e[t]++,!(e[t]<this.shape[t]));)e[t]=0,t--;if(t<0)break}}contiguous(){return this.isContiguous?this:new ge(this.shape,this.toFloat32Array())}toFloat32Array(){let e=this.shape.reduce((l,r)=>l*r,1),t=new Float32Array(e);if(this.isContiguous)t.set(this.buffer);else{let l=new Array(this.shape.length).fill(0),r=0,o=0;for(;;){t[r++]=this.buffer[o];let n=this.shape.length-1;for(;n>=0&&(l[n]++,o+=this.stride[n],!(l[n]<this.shape[n]));)o-=l[n]*this.stride[n],l[n]=0,n--;if(n<0)break}}return t}static fromJson(e){if(!e.shape||!e.dtype||!e.data)throw console.error("Invalid tensor json",e),new Error("Invalid tensor json");if(e.dtype!=="torch.float32")throw console.error("Invalid tensor dtype",e),new Error("Invalid tensor dtype");let t=St(e.data),l=new Float32Array(t);return new ge(e.shape,l)}copyFrom(e){if(e.shape.length!==this.shape.length||!e.contiguous||!this.contiguous)throw new Error(`Invalid copy: source shape length ${e.shape.length} does not match target shape length ${this.shape.length}`);for(let t=0;t<this.shape.length;t++)if(e.shape[t]!==this.shape[t])throw new Error(`Invalid copy: source shape ${e.shape[t]} does not match target shape ${this.shape[t]}`);this.buffer.set(e.buffer)}}function Vt(i){for(;i.angle.x<0;)i.angle.x+=360;for(;i.angle.x>360;)i.angle.x-=360;let e=i.angle.z,t=i.angle.x*Math.PI/180,l=i.angle.y*Math.PI/180,r=200*e,o=r*Math.sin(l),n=r*Math.cos(l)*Math.cos(t),s=r*Math.cos(l)*Math.sin(t),a=i.center,u=new y(n,s,o).add(a);return{lookAt:D.fromLookAt(u,a,new y(0,0,1)),camPos:u}}function wl(i,e,t=y.zero){let{camera:l}=i,r=new Lt;for(let m of e.cubes){let x=new y(m.x,m.y,m.z).add(t),v=new y(m.x+m.dx,m.y+m.dy,m.z+m.dz).add(t);r.addInPlace(x),r.addInPlace(v)}r.size().len();let{lookAt:o,camPos:n}=Vt(l);200*l.angle.z;const s=window.LLM_VIZ_ASPECT_SCALE??.85;let u=D.fromPersp(40,i.render.size.x/i.render.size.y*s,100,1e7).mul(o),f=new D;f[0]=1,f[5]=0,f[6]=-1,f[9]=-1,f[10]=0;const c=window.LLM_VIZ_MODEL_SCALE??.92;f[0]*=c,f[6]*=c,f[9]*=c,f[10]*=c,i.camera.modelMtx=f,i.camera.viewMtx=u,i.camera.camPos=n,i.camera.camPosModel=f.invert().mulVec3Affine(n),i.camera.lookAtMtx=o}function bl(i,e){return i.camera.camPosModel.dist(e)/i.render.size.y*5}function Al(i,e){(window.LLM_VIZ_AUTO_ROTATE??!0)&&(i.camera.angle.x+=e.dt*.01,e.markDirty());let l=i.camera.desiredCameraTransition;if(l)if(l.t<1){l.t=Oe(l.t+e.dt/1e3*1.5,0,1);let r=l.initialPos,o=l.targetPos;i.camera.angle=r.angle.lerp(o.angle,l.t),i.camera.center=r.center.lerp(o.center,l.t),e.markDirty()}else i.camera.desiredCameraTransition=void 0;i.camera.desiredCamera&&(i.camera.desiredCameraTransition={t:0,initialPos:{center:i.camera.center,angle:i.camera.angle},targetPos:i.camera.desiredCamera},i.camera.desiredCamera=void 0,e.markDirty())}function zl(i,e){let t=i.gl,l=t.createVertexArray();t.bindVertexArray(l);let r=t.createBuffer(),o=Be(t,r,{},[{name:"a_position",size:3},{name:"a_lineDirA",size:3},{name:"a_lineDirB",size:3},{name:"a_color",size:4},{name:"a_thickness",size:1},{name:"a_firstPair",size:1},{name:"a_normal",size:3},{name:"a_dash",size:1},{name:"a_t",size:1}]),n=Ee(t,t.ARRAY_BUFFER,r,1024,o,null),s=t.createBuffer(),a=ni(t,s,1024,e),u=W(i,"line",`#version 300 es
        precision highp float;
        ${Te}
        uniform vec2 u_viewSizeInv;
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_lineDirA;
        layout(location = 2) in vec3 a_lineDirB;
        layout(location = 3) in vec4 a_color;
        layout(location = 4) in float a_thickness;
        layout(location = 5) in float a_firstPair;
        layout(location = 6) in vec3 a_normal;
        layout(location = 7) in float a_dash;
        layout(location = 8) in float a_t;
        out vec2 v_linePos;
        out vec4 v_color;
        out float v_thickness;
        out float v_dash;
        void main() {

            float mul = 1.0;
            if (gl_VertexID % 2 == 0) {
                mul = -1.0;
            }

            bool firstPair = a_firstPair > 0.0;

            float width;

            if (length(a_normal) == 0.0) {
                vec4 clipPos = u_view * u_model * vec4(a_position, 1);
                vec2 screenPos = clipPos.xy / clipPos.w;

                vec4 lineDirAClip = u_view * u_model * vec4(a_position + a_lineDirA, 1);
                vec2 lineDirA = normalize(lineDirAClip.xy / lineDirAClip.w - screenPos);
                vec4 lineDirBClip = u_view * u_model * vec4(a_position + a_lineDirB, 1);
                vec2 lineDirB = normalize(lineDirBClip.xy / lineDirBClip.w - screenPos);

                vec2 avgDir = normalize(lineDirA + lineDirB);
                vec2 activeDir = firstPair ? lineDirA : lineDirB;

                float scale = sqrt(2.0) / length(lineDirA + lineDirB);
                vec2 offset = vec2(-avgDir.y, avgDir.x);

                if (scale > 5.0) {
                    bool isOuter = cross(vec3(lineDirA, 0), vec3(lineDirB, 0)).z * mul < 0.0;
                    if (isOuter) {
                        offset = vec2(-activeDir.y, activeDir.x);
                        scale = 1.0 / sqrt(2.0);
                    } else {
                        offset = vec2(-activeDir.y, activeDir.x);
                        scale = 1.0 / sqrt(2.0);
                    }
                }

                width = a_thickness * 2.0;
                vec2 linePos = screenPos + offset * u_viewSizeInv * width * mul * scale;

                gl_Position = vec4(linePos.xy * clipPos.w, clipPos.z, clipPos.w);
                v_thickness = a_thickness;

            } else {

                width = a_thickness * 2.0;
                vec3 activeDir = firstPair ? a_lineDirA : a_lineDirB;

                vec3 avgDir = normalize(a_lineDirA + a_lineDirB);
                vec3 offset = normalize(cross(a_normal, avgDir));
                // need to scale by the amount of angle between the two line directions
                float scale = sqrt(2.0) / length(a_lineDirA + a_lineDirB);

                // if we exceed the miter limit (90 degrees), we need to clamp the line width, and draw a bevel instead.
                // the inner corner stays the same, but the outer corner is a bevel.

                if (scale > 2.0) {
                    bool isOuter = cross(a_lineDirA, a_lineDirB).z * mul < 0.0;

                    if (isOuter) {
                        offset = normalize(cross(a_normal, activeDir));
                        scale = 1.0 / sqrt(2.0);
                    }
                }

                vec3 linePos = a_position + offset * mul * width * scale;

                gl_Position = u_view * u_model * vec4(linePos, 1);
                v_thickness = 100.0;

            }

            v_dash = a_dash;
            v_color = a_color;
            v_linePos = vec2(mul * width, a_t);
        }
    `,`#version 300 es
        precision highp float;
        in vec2 v_linePos;
        in vec4 v_color;
        in float v_thickness;
        in float v_dash;
        out vec4 o_color;

        void main() {
            float lineWidth = v_thickness - 1.0;
            float edge0 = lineWidth / 2.0;
            float edge1 = lineWidth / 2.0 + fwidth(v_linePos.x);
            float t = 1.0 - smoothstep(edge0, edge1, abs(v_linePos.x));

            if (v_dash > 0.0) {
                float dashPos = mod(v_linePos.y, v_dash);
                if (dashPos > v_dash / 2.0) {
                    t = 0.0;
                }
            }

            if (t == 0.0) {
                discard;
            }

            o_color = v_color * t;
        }
    `,["u_viewSizeInv"],{uboBindings:{ModelViewUbo:Q.ModelView}});return{gl:t,vao:l,floatBuf:n,indexBuf:a,lineShader:u,sharedRender:e}}function Bl(i={}){return{thick:+(i.thick||1),color:i.color||new C(1,1,1,1),mtx:i.mtx||D.identity,n:i.n||void 0,closed:i.closed||!1,dash:i.dash??0}}let Ce=new y,Ie=new y,te=new y;function it(i,e,t,l,r,o,n,s,a){let u=i.sharedRender.activePhase,f=i.floatBuf.localBufs[0],c=f.buf,m=i.indexBuf.localBufs[u],x=m.buf;ye(f,4),Ne(m,5),Ce.copy_(l),Ie.copy_(r),s=s??0,te.x=Ie.x-Ce.x,te.y=Ie.y-Ce.y,te.z=Ie.z-Ce.z;let v=te.len(),d=1/v;te.x*=d,te.y*=d,te.z*=d;let p=[Ce,Ce,Ie,Ie];o=o??y.zero;let _=f.usedEls*f.strideFloats,b=m.usedVerts;for(let h=0;h<4;h++)c[_+0]=p[h].x,c[_+1]=p[h].y,c[_+2]=p[h].z,c[_+3]=te.x,c[_+4]=te.y,c[_+5]=te.z,c[_+6]=te.x,c[_+7]=te.y,c[_+8]=te.z,c[_+9]=t.x,c[_+10]=t.y,c[_+11]=t.z,c[_+12]=t.w,c[_+13]=e,c[_+14]=1,c[_+15]=o.x,c[_+16]=o.y,c[_+17]=o.z,c[_+18]=s,c[_+19]=h<2?0:v,_+=f.strideFloats,x[b+h]=f.usedEls+h;x[b+4]=4294967295,f.usedEls+=4,m.usedVerts+=5}let vi=new Float32Array(6),re=vi.subarray(0,3),Le=vi.subarray(3,6),lt=new Float32Array(0);function El(i,e,t){let l=i.sharedRender.activePhase,r=i.floatBuf.localBufs[0],o=r.buf,n=i.indexBuf.localBufs[l],s=n.buf,a=e.length,u=(t.n??y.zero).clone();if(t.mtx){lt.length<e.length&&(lt=new Float32Array(e.length));for(let A=0;A<e.length;A+=3)t.mtx.mulVec3AffineArr_(e,A,lt,A);e=lt,t.mtx.mulVec3AffineVec_(u,u)}let f=a/3+(t.closed?1:0);ye(r,f*4),Ne(n,f*4+1),t.closed&&(ie.sub_(e,0,e,a-3,Le,0),ie.normalize_(Le,0,Le,0));let c=t.dash??0,m=t.color.x,x=t.color.y,v=t.color.z,d=t.color.w,p=t.thick,_=u.x,b=u.y,h=u.z,g=0;for(let A=0;A<f;A++){let z=A*3;t.closed&&A===f-1&&(z=0);let F=0;!t.closed&&A<f-1||t.closed&&A!==f-2?(ie.sub_(e,z+3,e,z,re,0),F=ie.len_(re,0),ie.normalize_(re,0,re,0)):t.closed&&A===f-2&&(ie.sub_(e,0,e,a-3,re,0),F=ie.len_(re,0),ie.normalize_(re,0,re,0));let R=r.usedEls*r.strideFloats,L=n.usedVerts,q=A==0&&!t.closed?re:Le,U=A==f-1&&!t.closed?Le:re,I=t.closed&&A===f-1?2:4;for(let j=0;j<I;j++)ie.copy_(e,z,o,R),ie.copy_(q,0,o,R+3),ie.copy_(U,0,o,R+6),o[R+9]=m,o[R+10]=x,o[R+11]=v,o[R+12]=d,o[R+13]=p,o[R+14]=j>2?0:1,o[R+15]=_,o[R+16]=b,o[R+17]=h,o[R+18]=c,o[R+19]=g,R+=r.strideFloats,s[L+j]=r.usedEls+j;r.usedEls+=I,n.usedVerts+=I,g+=F,ie.copy_(re,0,Le,0)}s[n.usedVerts]=4294967295,n.usedVerts+=1}function Rl(i){let e=i.gl;Re(e,i.floatBuf),si(e,i.indexBuf)}function Ml(i,e){let t=i.gl,l=i.indexBuf.localBufs[e];if(l.usedVerts===0)return;t.disable(t.CULL_FACE),t.depthMask(!1),t.useProgram(i.lineShader.program),t.bindVertexArray(i.vao);let r=i.lineShader.locs;t.uniform2f(r.u_viewSizeInv,1/t.canvas.width,1/t.canvas.height),t.drawElements(t.TRIANGLE_STRIP,l.usedVerts,t.UNSIGNED_INT,l.glOffsetBytes),t.depthMask(!0)}function Fl(i){Me(i.floatBuf),ai(i.indexBuf)}function Pl(i,e){let t=i.gl,l=t.createVertexArray();t.bindVertexArray(l);let r=t.createBuffer(),o=Be(t,r,{},[{name:"a_pos",size:3},{name:"a_normal",size:3},{name:"a_color",size:4},{name:"a_uv",size:2}]),n=Ee(t,t.ARRAY_BUFFER,r,1024,o,null),s=t.createBuffer(),a=ni(t,s,1024,e),u=W(i,"triangles",`#version 300 es
        precision highp float;
        ${Te}
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;
        layout(location = 2) in vec4 a_color;
        layout(location = 3) in vec2 a_uv;
        out vec4 v_color;
        out vec2 v_uv;
        out vec3 v_normal;
        void main() {
            gl_Position = u_view * u_model * vec4(a_position, 1);
            v_color = a_color;
            v_normal = a_normal;
            v_uv = a_uv;
        }
    `,`#version 300 es
        precision highp float;
        in vec2 v_uv;
        in vec3 v_normal;
        in vec4 v_color;
        out vec4 o_color;

        void main() {
            o_color = v_color;
        }
    `,[],{uboBindings:{ModelViewUbo:Q.ModelView}});return{gl:t,vao:l,vbo:n,ibo:a,triShader:u,sharedRender:e}}let pi=new y(0,0,1),We=new y,$e=new y;function fe(i,e,t,l,r){let o=i.sharedRender.activePhase,n=i.vbo.localBufs[0],s=i.ibo.localBufs[o];ye(n,1),Ne(s,1);let a=n.buf,u=s.buf,f=n.usedEls*n.strideFloats,c=s.usedVerts;r?(r.mulVec3Affine_(e,We),r.mulVec3AffineVec_(l||pi,$e)):(We.copy_(e),$e.copy_(l||pi)),a[f+0]=We.x,a[f+1]=We.y,a[f+2]=We.z,a[f+3]=$e.x,a[f+4]=$e.y,a[f+5]=$e.z,a[f+6]=t.x,a[f+7]=t.y,a[f+8]=t.z,a[f+9]=t.w,a[f+10]=0,a[f+11]=0,u[c]=n.usedEls,n.usedEls+=1,s.usedVerts+=1}let rt=new y,ot=new y;function Tl(i,e,t,l,r,o=!0){if(rt.x=t.x,rt.y=e.y,rt.z=e.z,ot.x=e.x,ot.y=t.y,ot.z=t.z,fe(i,e,l,void 0,r),fe(i,ot,l,void 0,r),fe(i,rt,l,void 0,r),fe(i,t,l,void 0,r),o){let n=i.sharedRender.activePhase,s=i.ibo.localBufs[n];Ne(s,1),s.buf[s.usedVerts++]=4294967295}}function yi(i){let e=i.sharedRender.activePhase,t=i.ibo.localBufs[e];Ne(t,1),t.buf[t.usedVerts++]=4294967295}function Cl(i){let e=i.gl;Re(e,i.vbo),si(e,i.ibo)}function Il(i,e){let t=i.gl,l=i.ibo.localBufs[e];l.usedVerts!==0&&(t.depthMask(e===ee.Opaque),t.disable(t.CULL_FACE),t.useProgram(i.triShader.program),t.bindVertexArray(i.vao),t.drawElements(t.TRIANGLE_STRIP,l.usedVerts,t.UNSIGNED_INT,l.glOffsetBytes),t.depthMask(!0))}function Ll(i){ai(i.ibo),Me(i.vbo)}let gi=new Float32Array(1024*3);function Sl(i,e,t,l,r){let o=gi,n=0,s=[];function a(u,f,c,m){s.push({p0:u,p1:f,p2:c,p3:m})}for(a(i,e,t,l),l.writeToBuf(o,n),n+=3;s.length>0;){let{p0:u,p1:f,p2:c,p3:m}=s.pop(),x=u.mid(f),v=f.mid(c),d=c.mid(m),p=x.mid(v),_=v.mid(d),b=p.mid(_),h=m.sub(u),g=f.sub(m),A=c.sub(m),z=Math.abs(g.y*h.z-g.z*h.y),F=Math.abs(A.y*h.z-A.z*h.y);if((z+F)*(z+F)>r*h.lenSq())a(u,x,p,b),a(b,_,d,m);else{if(n+6>o.length){let L=new Float32Array(o.length*2);L.set(o),o=L}u.writeToBuf(o,n),n+=3}}return gi=o,o.slice(0,n)}function kl(){return new C(.67,0,0,1)}function me(i){return"#aa0000"}function Dl(i,e){let t=2,l=e.residual0,r=6,o=C.fromHexColor(me()),n=C.fromHexColor(me());a(e.idxObj,e.residual0),u(e.tokEmbedObj,e.residual0),x(e.posEmbedObj,0,e.residual0,1);for(let v=0;v<3;v++){let d=e.blocks[v];a(l,d.attnResidual),c(l,d.ln1.lnResid),c(l,d.ln1.lnAgg2,2),a(d.ln1.lnAgg2,d.ln1.lnResid,2);for(let p of d.heads)x(d.ln1.lnResid,0,p.qBlock,1),x(d.ln1.lnResid,0,p.kBlock,1),x(d.ln1.lnResid,0,p.vBlock,1),u(p.qBiasBlock,p.qWeightBlock),u(p.kBiasBlock,p.kWeightBlock),u(p.vBiasBlock,p.vWeightBlock),u(p.qWeightBlock,p.qBlock),u(p.kWeightBlock,p.kBlock),u(p.vWeightBlock,p.vBlock),m(p.qBlock,p.attnMtx,0,void 0,p.qBlock.y!==p.kBlock.y),m(p.kBlock,p.attnMtx,0,void 0,p.kBlock.y!==p.qBlock.y),m(p.vBlock,p.vOutBlock,0,void 0,p.vBlock.y!==p.kBlock.y),x(p.attnMtx,0,p.attnMtxAgg2,1),x(p.attnMtxAgg1,0,p.attnMtxSm,1),x(p.attnMtxSm,3,p.vOutBlock,0),x(p.vOutBlock,3,d.attnOut,2);a(d.attnResidual,d.mlpResidual),u(d.attnOut,d.attnResidual),u(d.projBias,d.projWeight),u(d.projWeight,d.attnOut),u(d.ln1.lnMu,d.ln1.lnSigma),u(d.ln1.lnSigma,d.ln1.lnResid),c(d.attnResidual,d.ln2.lnAgg2,2),a(d.ln2.lnAgg2,d.ln2.lnResid,2),u(d.ln2.lnMu,d.ln2.lnSigma),u(d.ln2.lnSigma,d.ln2.lnResid),c(d.attnResidual,d.ln2.lnResid),x(d.ln2.lnResid,3,d.mlpFc,1),a(d.mlpFcBias,d.mlpFcWeight),a(d.mlpFcWeight,d.mlpFc,12),a(d.mlpFc,d.mlpAct,12),u(d.mlpProjBias,d.mlpProjWeight),u(d.mlpProjWeight,d.mlpResult),u(d.mlpResult,d.mlpResidual),x(d.mlpAct,1,d.mlpResult,2),l=d.mlpResidual}c(l,e.ln_f.lnAgg2,2),x(l,3,e.ln_f.lnResid,1),a(e.ln_f.lnAgg2,e.ln_f.lnResid),u(e.ln_f.lnMu,e.ln_f.lnSigma),u(e.ln_f.lnSigma,e.ln_f.lnResid),e.logitsTransposed?(x(e.ln_f.lnResid,3,e.logits,1),a(e.lmHeadWeight,e.logits),a(e.logits,e.logitsSoftmax),u(e.logits,e.logitsAgg1,2),x(e.logitsAgg2,3,e.logitsSoftmax,1,2)):(a(e.ln_f.lnResid,e.logits),u(e.lmHeadWeight,e.logits),a(e.logits,e.logitsAgg2),a(e.logitsAgg1,e.logitsSoftmax));function s(v){return v.t==="w"?o:n}function a(v,d,p=6){x(v,3,d,2,p)}function u(v,d,p=6){x(v,1,d,0,p)}function f(v,d){let p=v.z+v.dz/2;switch(d){case 0:return new y(v.x-t,v.y+v.dy/2,p);case 1:return new y(v.x+v.dx+t,v.y+v.dy/2,p);case 2:return new y(v.x+v.dx/2,v.y-t,p);case 3:return new y(v.x+v.dx/2,v.y+v.dy+t,p)}}function c(v,d,p=6){let _=f(v,3),b=f(d,1),h=Math.min(v.opacity,d.opacity);if(h===0)return;let g=new y(0,0,1),A=s(v).mul(h),z=new y(_.x-r/2,b.y);de(i,z,b,p,g,A,!0)}function m(v,d,p,_=6,b=!1){let h=f(v,3),g=h.z>d.z+d.dz/2,A=new y(d.x+d.dx/2,d.y+e.cell*(p+.5),g?d.z+d.dz/2+t:d.z-t),z=Math.min(v.opacity,d.opacity);if(z===0)return;let F=new y(0,0,1),R=s(v).mul(z),L=new y(0,0,g?-1:1);Math.abs(h.z-(d.z+d.dz/2))<1&&!b&&(L=void 0,A=f(d,2)),de(i,h,A,_,F,R,!0,0,L)}function x(v,d,p,_,b=6){let h=f(v,d),g=f(p,_),A=Math.min(v.opacity,p.opacity);if(A===0)return;let z=new y(0,0,1),F=s(v).mul(A);if(d===0&&_===1&&(h.y=g.y),d===1&&_===2){let R=new y(g.x-b/2,h.y,h.z),L=new y(g.x,h.y+b/2,g.z);de(i,h,R,b,z,F,!1),de(i,L,g,b,z,F,!0,1)}else if(d===3&&_===1){let R=new y(h.x,g.y-b/2,g.z),L=new y(h.x-b/2,g.y,g.z);de(i,h,R,b,z,F,!1),de(i,L,g,b,z,F,!0,1)}else if(d===3&&_===0){let R=new y(h.x,g.y-b/2,g.z),L=new y(h.x+b/2,g.y,g.z);de(i,h,R,b,z,F,!1,0,new y(0,1,0)),de(i,L,g,b,z,F,!0,2)}else de(i,h,g,b,z,F,!0)}}let Ot=new Float32Array(12);function de(i,e,t,l,r,o,n=!0,s=0,a){let u=t.sub(e);u.z=0,u=u.normalize();let f=t.sub(e).len(),m=n?Math.min(f*.7,3*1):0,x=new D,v=y.cross(u,r).mul(-1).normalize();r=y.cross(v,u).normalize(),x[0]=v.x,x[1]=v.y,x[2]=v.z,x[4]=u.x,x[5]=u.y,x[6]=u.z,x[8]=r.x,x[9]=r.y,x[10]=r.z,e=x.mulVec3Proj(e),t=x.mulVec3Proj(t);let d=o.mul(.8),p=o.mul(.3),_={width:l,borderColor:d,ribbonColor:p,lineThick:1.2,mtx:x};a=a?x.mulVec3ProjVec(a):void 0;function b(){let h=Math.max(m,Math.abs(e.y-t.y-m)/2),g=new y(e.x,e.y,e.z),A=new y(e.x,e.y+h,e.z),z=new y(t.x,t.y-m-h,t.z),F=new y(t.x,t.y-m,t.z);a&&(z=t.mulAdd(a,-m-h),F=t.mulAdd(a,-m));let R=Sl(g,A,z,F,.1),L=R.length/3,q=n?3:0,U=(L*2+q)*3;Ot.length<U&&(Ot=new Float32Array(U));let I=Ot.subarray(0,U);for(let S=0;S<L-1;S++){let G=new y(R[S*3+0],R[S*3+1],R[S*3+2]),V=new y(R[S*3+3],R[S*3+4],R[S*3+5]);_i(i,G,V,_)}let j=L,K=j+q;for(let S=0;S<L;S++){let G=K+S;I[G*3+0]=R[S*3+0]+_.width/2,I[G*3+1]=R[S*3+1],I[G*3+2]=R[S*3+2];let V=L-S-1;I[V*3+0]=R[S*3+0]-_.width/2,I[V*3+1]=R[S*3+1],I[V*3+2]=R[S*3+2]}if(n){let S=3;a=a??new y(0,1,0);let G=t.mulAdd(a,-m),V=j;I[V*3+0]=G.x-_.width/2-S,I[V*3+1]=G.y,I[V*3+2]=G.z,V+=1,I[V*3+0]=t.x,I[V*3+1]=t.y,I[V*3+2]=t.z,V+=1,I[V*3+0]=G.x+_.width/2+S,I[V*3+1]=G.y,I[V*3+2]=G.z}let oe=Bl({thick:_.lineThick,mtx:_.mtx,color:_.borderColor});El(i.lineRender,I,oe)}Math.abs(e.z-t.z)>.01||a?b():_i(i,e,t.sub(new y(0,m)),_),s!==0&&Xl(i,e.sub(new y(0,l/2)),s,_),n&&(a=a??new y(0,1,0),Ul(i,t.mulAdd(a,-m),t,_))}let nt=new y,st=new y;function _i(i,e,t,l){nt.x=e.x-l.width/2,nt.y=e.y,nt.z=e.z,st.x=t.x+l.width/2,st.y=t.y,st.z=t.z,Tl(i.triRender,nt,st,l.ribbonColor,l.mtx)}let at=new y,wi=new y,Nt=new y,Wt=new y,$t=new y,Yt=new y,qt=new y(0,0,1);function Ul(i,e,t,l){let r=3;at.copy_(e),at.x-=l.width/2,wi.copy_(e),wi.x+=l.width/2,Nt.copy_(t),Nt.x+=l.width/2,Wt.copy_(e),Wt.x=at.x-r,$t.copy_(e),$t.x=Nt.x+r,Yt.copy_(t),Yt.x=at.x+l.width/2,fe(i.triRender,Wt,l.ribbonColor,qt,l.mtx),fe(i.triRender,Yt,l.ribbonColor,qt,l.mtx),fe(i.triRender,$t,l.ribbonColor,qt,l.mtx),yi(i.triRender)}let Se=new y,bi=new y(0,0,1),ke=new y,jt=new y;function Xl(i,e,t,l){let r=t===1?1:-1;Se.x=e.x+l.width/2*r,Se.y=e.y+l.width/2,Se.z=e.z,ke.z=e.z,jt.z=e.z;let o=8;for(let n=0;n<o;n++){let s=n/(o-1)*Math.PI/2,a=l.width*Math.cos(s)*r,u=l.width*Math.sin(s);ke.x=Se.x-a,ke.y=Se.y-u,fe(i.triRender,ke,l.ribbonColor,bi,l.mtx),fe(i.triRender,Se,l.ribbonColor,bi,l.mtx);let f=jt;jt=ke,ke=f}yi(i.triRender)}var w=(i=>(i[i.None=0]="None",i[i.t=1]="t",i[i.T=2]="T",i[i.C=3]="C",i[i.B=4]="B",i[i.A=5]="A",i[i.n_vocab=6]="n_vocab",i[i.n_heads=7]="n_heads",i[i.n_layers=8]="n_layers",i[i.Token=9]="Token",i[i.TokenIdx=10]="TokenIdx",i[i.C4=11]="C4",i[i.Intermediates=12]="Intermediates",i[i.Weights=13]="Weights",i[i.Aggregates=14]="Aggregates",i))(w||{});function Vl(i){switch(i){case 1:case 2:return C.fromHexColor(me());case 5:return C.fromHexColor(me());case 3:case 11:return C.fromHexColor(me());case 9:return new C(.3,.7,.3,1);case 10:return C.fromHexColor(me());case 6:return C.fromHexColor(me());case 12:return C.fromHexColor(me());case 13:return _e.Weights;case 14:return C.fromHexColor(me())}return new C(0,0,0)}function Ol(i){switch(i){case 10:return"Token Index";case 11:return"C * 4";default:return w[i]}}const _e={get Weights(){return kl()},Intermediates:new C(.4,.8,.4),Aggregates:new C(1,.8,.3)};function ct(i,e,t,l,r,o){let n=i.render,{vecId:s}=Ai(l),{cx:a}=Ye(t,l),u=s===0?1:0,f=Ol(r);if(r===w.None)return;let c=Bi(e,t,l,0),m=Bi(e,t,l,a-1)+e.cell,x=(m+c)/2,v=l===T.X?new y(x,t.y+t.dz,t.z+t.dz):new y(t.x,x,t.z+t.dz),d=l===T.X?-1:1,p=bl(i,v);p=Math.min(p,1);let _=2.5*p,b=hi(n.modelFontBuf,f,_),h=_,g=l===T.X?b/2+_*.4:l===T.Y?h/2+_*.4:0,A=_*.3,z=_/2*.5,F=Vl(r).mul(o),R=.1,L=new y(t.x,t.y+t.dy,t.z+t.dz+R).setAt(s,x).withAddAt(u,-d*(_/2+A)),q=0,U=b>m-c-g*2;U&&(q=d*_);let I=D.fromTranslation(L),j=l===T.X||l===T.Y?-b/2:0,K=l===T.X?-q-_/2:l===T.Y?-_/2:0;xi(n.modelFontBuf,f,F,j,K,_,I);let oe=t.x,S=t.y+t.dy,G=t.z+t.dz+R,V=_*.02,Ue=new y(0,0,1);U&&(g=0);let he=new y(oe,S,G).withAddAt(u,-d*(_/2+A)),se=he.withSetAt(s,c),we=he.withSetAt(s,m),Fe=he.withSetAt(s,x-g),qe=he.withSetAt(s,x+g);it(n.lineRender,V,F,se,Fe,Ue),it(n.lineRender,V,F,we,qe,Ue),it(n.lineRender,V,F,se.withAddAt(u,z),se.withAddAt(u,-z),Ue),it(n.lineRender,V,F,we.withAddAt(u,z),we.withAddAt(u,-z),Ue)}let Nl={vecId:0,xName:"x",dxName:"dx",cxName:"cx",offXName:"offX",sizeXName:"sizeX"},Wl={vecId:1,xName:"y",dxName:"dy",cxName:"cy",offXName:"offY",sizeXName:"sizeY"},$l={vecId:2,xName:"z",dxName:"dz",cxName:"cz",offXName:"offZ",sizeXName:"sizeZ"};function Ai(i){return i===T.X?Nl:i===T.Y?Wl:$l}function Ye(i,e){switch(e){case T.X:return{x:i.x,cx:i.cx,dx:i.dx,rangeOffsets:i.rangeOffsetsX,offX:i.offX??0,sizeX:i.sizeX??i.cx};case T.Y:return{x:i.y,cx:i.cy,dx:i.dy,rangeOffsets:i.rangeOffsetsY,offX:i.offY??0,sizeX:i.sizeY??i.cy};case T.Z:return{x:i.z,cx:i.cz,dx:i.dz,rangeOffsets:i.rangeOffsetsZ,offX:i.offZ??0,sizeX:i.sizeZ??i.cz}}}function ut(i,e,t,l){let{x:r,cx:o,rangeOffsets:n}=Ye(e,t);if(o<=1)return e;if(n&&e.subs)for(let s of e.subs){let a=De(i,s,t,l);if(a)return a}return De(i,e,t,l)}function De(i,e,t,l,r){let{offX:o,sizeX:n}=Ye(e,t),s=[],a=[],u=Math.floor(l)-o;if(u<0||u>=n)return null;if(n<=1)return e;function f(m,x,v){let d=Yl(i,e,t,m,x,v);return d&&(s.push(d.subBlock),a.push(d.rangeOffset)),(d==null?void 0:d.subBlock)??null}let c;return f(0,u,0),c=f(u,u+1,0),f(u+1,n,0),s.length>0?(t===T.X&&(e.rangeOffsetsX=a),t===T.Y&&(e.rangeOffsetsY=a),t===T.Z&&(e.rangeOffsetsZ=a),e.subs=s,c):null}function Yl(i,e,t,l,r,o){let{x:n,cx:s,sizeX:a,offX:u}=Ye(e,t),{vecId:f,xName:c,dxName:m,offXName:x,sizeXName:v}=Ai(t);if(l>=r||r<=0||l>=a)return null;let d=(r-l)/a,p=l/a,_=D.fromScaleTranslation(new y(1,1,1).setAt(f,d),new y().setAt(f,p));return{subBlock:{...e,[m]:(r-l)*i.cell,access:e.access&&{...e.access},localMtx:(e.localMtx??new D).mul(_),[c]:n+(l*i.cell+o),[x]:l+u,[v]:r-l},rangeOffset:[r,o]}}function ql(i,e,t,l){var s;if(!i.subs)return[];let r=e===T.X?i.rangeOffsetsX:e===T.Y?i.rangeOffsetsY:i.rangeOffsetsZ;t=t===null?null:Math.floor(t),l=l===null?null:Math.floor(l);let o=[],n=0;for(let a=0;a<i.subs.length;a+=1){let u=(s=r==null?void 0:r[a])==null?void 0:s[0];if(ze(u))break;(t===null||t<u)&&(l===null||l>=n)&&o.push(i.subs[a]),n=u}return o}var zi=(i=>(i[i.None=0]="None",i[i.Softmax=1]="Softmax",i[i.Gelu=2]="Gelu",i[i.LayerNorm=3]="LayerNorm",i[i.InputEmbed=4]="InputEmbed",i[i.LayerNormMu=5]="LayerNormMu",i[i.LayerNormSigma=6]="LayerNormSigma",i[i.SoftmaxAggMax=7]="SoftmaxAggMax",i[i.SoftmaxAggExp=8]="SoftmaxAggExp",i[i.Attention=9]="Attention",i))(zi||{});let jl="0xybi";function Hl(i){let e=D.zeros();for(let t=0;t<i.length;t++){let l=jl.indexOf(i[t]);l>0&&e.s(t,l-1,1)}return e}function Gl(i){let e=(t,l)=>({src:t,srcIdxMtx:Hl(l)});return{dot:i.dot&&i.dot.map(([t,l])=>e(t,l)),dotLen:i.dotLen,add:i.add&&i.add.map(([t,l])=>e(t,l)),special:i.special??0,lowerTri:i.lowerTri}}function Bi(i,e,t,l){let{x:r,rangeOffsets:o}=Ye(e,t),n=r+i.cell*l;if(!o)return n;for(let[s,a]of o)if(l<s)return n+a;return n}function Ht(i,e=null,t=new y(0,0,0)){let{B:l,T:r,C:o,vocabSize:n,nHeads:s,A:a,nBlocks:u}=i,f=i.nBlocks>12,c=0,m=1.5,x=Math.max(12,o/10);function v(B){var ae;let P=[B.xL,B.xR,B.xM].map(k=>+!ze(k)).reduce((k,le)=>k+le,0),X=[B.zF,B.zB,B.zM].map(k=>+!ze(k)).reduce((k,le)=>k+le,0);if(P!==1||X!==1)throw new Error(`Must supply exactly 1 x arg & 1 y arg: ${JSON.stringify(B)}`);let xe=B.cx*m,ve=B.cz*m,pe=ze(B.xL)?ze(B.xR)?B.xM-xe/2:B.xR-xe:B.xL,ne=ze(B.zB)?ze(B.zF)?B.zM-ve/2:B.zF-ve:B.zB;function Pe(k){return k.length===4?k:[...k,0]}return{dx:B.cx*m,dy:B.cy*m,dz:B.cz*m,t:B.t,x:pe,y:B.y,z:ne,cx:B.cx,cy:B.cy,cz:B.cz,dimX:B.dimX,dimY:B.dimY,name:B.name??"<unknown>",access:(ae=B.access)!=null&&ae.src?{channel:B.access.channel??"r",src:B.access.src,scale:B.access.scale??1,mat:D.fromColMajor([...Pe(B.access.x),...Pe(B.access.y),0,0,0,0,0,0,0,0])}:void 0,deps:B.deps?Gl(B.deps):void 0,opacity:B.hidden?0:1,highlight:0,small:B.small??!1,special:B.special??0,transpose:B.transpose,idx:-1}}function d(B,P){return{visible:0,cubes:P??[]}}let p=[],_=v({t:"i",cx:r,cz:l,cy:1,y:c,xM:0,zM:0,access:{src:e==null?void 0:e.inputTokens,x:[0,1,0],y:[1,0,r],scale:1/n},dimX:w.T,dimY:w.None,name:"Tokens"}),b=-r*m/2-x,h=r*m/2+x;c+=m+x;let g=v({t:"w",xR:b,zM:0,y:c,cx:n,cz:1,cy:o,access:{src:e==null?void 0:e.vocabEmbed.weight,x:[0,1,0],y:[1,0,0],scale:10},dimX:w.n_vocab,dimY:w.C,name:"Token Embed"}),A=v({t:"w",xL:h,zM:0,y:c,cx:r,cz:1,cy:o,access:{src:e==null?void 0:e.posEmbed.weight,x:[0,1,0],y:[1,0,0],scale:10},dimX:w.T,dimY:w.C,name:"Position Embed"}),z=v({t:"i",xM:0,zM:0,y:c,cx:r,cz:l,cy:o,access:{src:e==null?void 0:e.add.output,x:[0,1,0],y:[1,0,r],scale:10},deps:{add:[[g,"iy"],[A,"xy"],[_,"x0"]],special:4},dimX:w.T,dimY:w.C,name:"Input Embed"});p.push(_,g,A,z);let F=d(c,[_,g,A,z]);c+=o*m+x;function R(B,P,X){let xe=b+B,ve=xe-r*m-x,pe=v({t:"a",cx:r,cz:l,cy:1,y:c,xR:xe,zM:0,access:{src:X==null?void 0:X.normAgg,x:[0,1,0],y:[1,0,r],scale:10,channel:"r"},deps:{add:[[P,"xi"]],special:5},dimX:w.T,dimY:w.None,small:!0,name:"LN Agg: μ, σ"}),ne=v({t:"a",cx:r,cz:l,cy:1,y:c+m,xR:xe,zM:0,access:{src:X==null?void 0:X.normAgg,x:[0,1,0],y:[1,0,r],scale:10,channel:"g"},deps:{add:[[P,"xi"]],special:6},dimX:w.T,dimY:w.None,small:!0,name:""});c+=2*m+x;let Pe=v({t:"w",cx:1,cz:1,cy:o,y:c,xR:ve,zM:0,access:{src:X==null?void 0:X.normWeight,x:[1,0,0],y:[0,1,0],scale:.5},dimX:w.None,dimY:w.C,name:"γ",small:!0}),ae=v({t:"w",cx:1,cz:1,cy:o,y:c,xR:ve-m*1-x,zM:0,access:{src:X==null?void 0:X.normBias,x:[1,0,0],y:[0,1,0]},dimX:w.None,dimY:w.C,name:"β",small:!0}),k=v({t:"i",cx:r,cz:l,cy:o,y:c,xR:xe,zM:0,access:{src:X==null?void 0:X.output,x:[0,1,0],y:[1,0,r],scale:1},deps:{add:[[P,"xy"],[pe,"xi"],[ne,"xi"],[Pe,"0y"],[ae,"0y"]],special:3},dimX:w.T,dimY:w.C,name:"Layer Norm"});return{lnAgg1:pe,lnAgg2:ne,lnResid:k,lnSigma:Pe,lnMu:ae,cubes:[pe,ne,Pe,ae,k]}}let L=b-(r+2)*m-3*x;function q(B,P){let X=R(0,B,P==null?void 0:P.ln_1),xe=3*x+o*m/16,ve=1*x+o*m/16,pe=3*l*m+ve*2+(f?0:xe),ne=c+a*m+x+(f?2*a*m:0),ae=ne+r*m+x,k=L,le=k-r*m-x,Jt=le-o*m-x,Ii=0,M=P==null?void 0:P.attn,Xe=[];for(let O=0;O<s;O++){let be=pe*O-(s-1)*pe/2,ti=be+l*m+ve,Ge=be,ii=be-l*m-ve,Bt=v({t:"w",cx:o,cz:1,cy:a,y:c,xR:le,zM:ti,access:{src:M==null?void 0:M.qkvWeight,x:[1,0,0],y:[0,1,0,0*o+a*O],scale:o*.25},dimX:w.C,dimY:w.A,name:"Q Weights"}),Et=v({t:"w",cx:o,cz:1,cy:a,y:c,xR:le,zM:Ge,access:{src:M==null?void 0:M.qkvWeight,x:[1,0,0],y:[0,1,0,1*o+a*O],scale:o*.25},dimX:w.C,dimY:w.A,name:"K Weights"}),Rt=v({t:"w",cx:o,cz:1,cy:a,y:c,xR:le,zM:ii,access:{src:M==null?void 0:M.qkvWeight,x:[1,0,0],y:[0,1,0,2*o+a*O],scale:o*.25},dimX:w.C,dimY:w.A,name:"V Weights"}),kr=v({t:"w",cx:o,cz:1,cy:a*3,y:c,xR:le,zM:Ge,dimX:w.C,dimY:w.C,name:"QKV Weights"}),Qe=v({t:"w",cx:1,cz:1,cy:a,y:c,xR:Jt,zM:ti,access:{src:M==null?void 0:M.qkvBias,x:[1,0,0],y:[0,1,0,0*o+a*O]},dimX:w.None,dimY:w.A,small:!0,name:"Q Bias"}),Ze=v({t:"w",cx:1,cz:1,cy:a,y:c,xR:Jt,zM:Ge,access:{src:M==null?void 0:M.qkvBias,x:[1,0,0],y:[0,1,0,1*o+a*O]},dimX:w.None,dimY:w.A,small:!0,name:"K Bias"}),Je=v({t:"w",cx:1,cz:1,cy:a,y:c,xR:Jt,zM:ii,access:{src:M==null?void 0:M.qkvBias,x:[1,0,0],y:[0,1,0,2*o+a*O]},dimX:w.None,dimY:w.A,small:!0,name:"V Bias"}),Mt=v({t:"i",cx:r,cz:l,cy:a,y:c,xR:k,zM:ti,access:{src:M==null?void 0:M.qkvOutput,x:[0,1,0,0*o+a*O],y:[1,0,r],scale:1},deps:{dot:[[Bt,"iy"],[X.lnResid,"xi"]],add:[[Qe,"0y"]],dotLen:o},dimX:w.T,dimY:w.A,name:"Q vectors"}),Ft=v({t:"i",cx:r,cz:l,cy:a,y:c,xR:k,zM:Ge,access:{src:M==null?void 0:M.qkvOutput,x:[0,1,0,1*o+a*O],y:[1,0,r],scale:1},deps:{dot:[[Et,"iy"],[X.lnResid,"xi"]],add:[[Ze,"0y"]],dotLen:o},dimX:w.T,dimY:w.A,name:"K vectors"}),Pt=v({t:"i",cx:r,cz:l,cy:a,y:c,xR:k,zM:ii,access:{src:M==null?void 0:M.qkvOutput,x:[0,1,0,2*o+a*O],y:[1,0,r],scale:1},deps:{dot:[[Rt,"iy"],[X.lnResid,"xi"]],add:[[Je,"0y"]],dotLen:o},dimX:w.T,dimY:w.A,name:"V vectors"}),Dr=v({t:"i",cx:r,cz:l,cy:a*3,y:c,xR:k,zM:Ge,dimX:w.T,dimY:w.C,name:"QKV vectors"}),Ur=k-(r+2)*m-2*x,Ve=v({t:"i",cx:r,cz:l,cy:r,y:ne,xR:k,zM:be,access:{src:M==null?void 0:M.attnMatrix,x:[1,0,0],y:[0,1,s*r,r*O],scale:1},deps:{dot:[[Mt,"yi"],[Ft,"xi"]],lowerTri:!0,dotLen:a,special:9},dimX:w.T,dimY:w.T,special:1,transpose:!0,name:"Attention Matrix"}),Tt=v({t:"a",cx:1,cz:l,cy:r,y:ne,xR:k-r*m-x-m,zM:be,access:{src:M==null?void 0:M.attnMatrixSoftmax,x:[0,0,0,1],y:[0,1,s*r,r*O],channel:"r"},deps:{add:[[Ve,"iy"]],special:8},dimX:w.None,dimY:w.T,small:!0,name:""}),Ct=v({t:"a",cx:1,cz:l,cy:r,y:ne,xR:k-r*m-x,zM:be,access:{src:M==null?void 0:M.attnMatrixSoftmax,x:[0,0,0,1],y:[0,1,s*r,r*O],channel:"g"},deps:{add:[[Ve,"iy"]],special:7},dimX:w.None,dimY:w.T,small:!0,name:""}),It=v({t:"i",cx:r,cz:l,cy:r,y:ne,xR:Ur,zM:be,access:{src:M==null?void 0:M.attnMatrixSoftmax,x:[1,0,0],y:[0,1,s*r,r*O],scale:2},deps:{add:[[Ve,"xy"],[Tt,"iy"],[Ct,"iy"]],lowerTri:!0,special:1},dimX:w.T,dimY:w.T,special:1,transpose:!0,name:"Attn Matrix Softmax"}),li=v({t:"i",cx:r,cz:l,cy:a,y:ae+O*Ii,xR:k,zM:be,access:{src:M==null?void 0:M.scaledVectors,x:[0,1,0,O*a],y:[1,0,r]},deps:{dot:[[Pt,"iy"],[It,"ix"]],dotLen:a},dimX:w.T,dimY:w.A,name:"V Output"}),Xi=[...f?[kr,Dr]:[Bt,Et,Rt,Mt,Ft,Pt],Qe,Ze,Je,Ve,Tt,Ct,It,li],Vi=d(1,Xi),Oi=d(1,[Bt,Qe,Mt]),Ni=d(1,[Et,Ze,Ft]),Wi=d(1,[Rt,Je,Pt]),$i=d(1,[Qe,Ze,Je]),Yi=d(1,[Ve,Tt,Ct,It]),qi=d(1,[li]),Xr={qWeightBlock:Bt,kWeightBlock:Et,vWeightBlock:Rt,qBiasBlock:Qe,kBiasBlock:Ze,vBiasBlock:Je,qBlock:Mt,kBlock:Ft,vBlock:Pt,attnMtx:Ve,attnMtxAgg1:Tt,attnMtxAgg2:Ct,attnMtxSm:It,vOutBlock:li,qLabel:Oi,kLabel:Ni,vLabel:Wi,biasLabel:$i,mtxLabel:Yi,vectorLabel:qi,headLabel:Vi,cubes:Xi,labels:[Oi,Ni,Wi,$i,Yi,qi,Vi]};Xe.push(Xr)}let Lr=v({t:"i",cx:r,cz:l,cy:o,y:ae,xR:k,zF:-pe*s/2,dimX:w.T,dimY:w.C,hidden:!0,name:"V Output Combined"}),je=Math.max(ae+Ii*(s-1)+a*m+2*x,c+o*m+x),ht=v({t:"w",cx:o,cz:1,cy:o,y:je,xR:le,zM:0,access:{src:M==null?void 0:M.proj.weight,x:[1,0,0],y:[0,1,0],scale:o*.5},dimX:w.C,dimY:w.C,name:"Projection Weights"}),xt=v({t:"w",cx:1,cz:1,cy:o,y:je,xR:le-o*m-x,zM:0,access:{src:M==null?void 0:M.proj.bias,x:[0,0,0],y:[0,1,0],scale:o*.5},dimX:w.None,dimY:w.C,small:!0,name:"Projection Bias"}),vt=v({t:"i",cx:r,cz:l,cy:o,y:je,xR:k,zM:0,access:{src:M==null?void 0:M.proj.output,x:[0,1,0],y:[1,0,r]},deps:{dot:[[ht,"iy"],[Lr,"xi"]],dotLen:o,add:[[xt,"0y"],...Xe.map(O=>[O.vOutBlock,"xi"])]},dimX:w.T,dimY:w.C,name:"Attention Output"}),He=v({t:"i",cx:r,cz:l,cy:o,y:je,xM:0,zM:0,access:{src:M==null?void 0:M.output,x:[0,1,0],y:[1,0,r]},deps:{add:[[vt,"xy"],[B,"xy"]]},dimX:w.T,dimY:w.C,name:"Attention Residual"});c=je+o*m+x;let pt=R(0,He,P==null?void 0:P.ln_2),yt=v({t:"w",cx:o*4,cz:1,cy:o,y:c,xR:k,zM:0,access:{src:P==null?void 0:P.mlp.fcLayer.weight,x:[0,1,0],y:[1,0,0],scale:o*.5},dimX:w.C4,dimY:w.C,name:"MLP Weights"}),gt=v({t:"w",cx:o*4,cz:1,cy:1,y:c-1*m-x,xR:k,zM:0,access:{src:P==null?void 0:P.mlp.fcLayer.bias,x:[0,1,0],y:[1,0,0],scale:o*.5},dimX:w.C4,dimY:w.None,name:"MLP Bias",small:!0});c+=o*m+x;let _t=v({t:"i",cx:o*4,cz:l,cy:r,y:c,xR:k,zM:0,access:{src:P==null?void 0:P.mlp.fcLayer.output,x:[1,0,0],y:[0,1,r],scale:1},deps:{dot:[[yt,"xi"],[pt.lnResid,"yi"]],dotLen:o,add:[[gt,"x"]]},dimX:w.C4,dimY:w.T,name:"MLP",transpose:!0});c+=r*m+x;let wt=v({t:"i",cx:o*4,cz:l,cy:r,y:c,xR:k,zM:0,access:{src:P==null?void 0:P.mlp.mlpGelu,x:[1,0,0],y:[0,1,r],scale:1},deps:{add:[[_t,"xy"]],special:2},dimX:w.C4,dimY:w.T,name:"MLP Activation",transpose:!0});c+=r*m+x;let bt=v({t:"w",cx:o*4,cz:1,cy:o,y:c,xR:k,zM:0,access:{src:P==null?void 0:P.mlp.projLayer.weight,x:[1,0,0],y:[0,1,0],scale:o*.5},dimX:w.C4,dimY:w.C,name:"MLP Projection Weights"}),At=v({t:"w",cx:1,cz:1,cy:o,y:c,xR:k-o*4*m-x,zM:0,access:{src:P==null?void 0:P.mlp.projLayer.bias,x:[1,0,0],y:[0,1,0],scale:o*.5},dimX:w.None,dimY:w.C,small:!0,name:"MLP Projection Bias"}),zt=v({t:"i",cx:r,cz:l,cy:o,y:c,xL:k+x,zM:0,access:{src:P==null?void 0:P.mlp.projLayer.output,x:[0,1,0],y:[1,0,r]},deps:{dot:[[bt,"iy"],[wt,"ix"]],dotLen:o,add:[[At,"0y"]]},dimX:w.T,dimY:w.C,name:"MLP Result"}),Kt=v({t:"i",cx:r,cz:l,cy:o,y:c,xM:0,zM:0,access:{src:P==null?void 0:P.mlp.output,x:[0,1,0],y:[1,0,r]},deps:{add:[[zt,"xy"],[He,"xy"]]},dimX:w.T,dimY:w.C,name:"MLP Residual"});c+=o*m-x;let ei=[...X.cubes,...Xe.flatMap(O=>O.cubes),ht,xt,vt,He,...pt.cubes,yt,gt,_t,wt,bt,At,zt,Kt],Sr=[...X.cubes,...Xe.flatMap(O=>O.cubes)],Li=[ht,xt,vt,He],Si=d(1,ei),ki=d(1,[...Sr,...Li]),Di=d(1,Li),Ui=d(1,[...pt.cubes,yt,gt,_t,wt,bt,At,zt,Kt]);return p.push(...ei),{ln1:X,heads:Xe,labels:[Si,Di,ki,Ui,...Xe.flatMap(O=>O.labels)],cubes:ei,transformerLabel:Si,projLabel:Di,selfAttendLabel:ki,mlpLabel:Ui,projWeight:ht,projBias:xt,attnOut:vt,attnResidual:He,mlpFc:_t,mlpFcWeight:yt,mlpFcBias:gt,mlpAct:wt,mlpProjWeight:bt,mlpProjBias:At,mlpResult:zt,mlpResidual:Kt,ln2:pt}}let U=2*x;c+=U;let I=12;i.nBlocks>I&&Math.ceil(i.nBlocks/I);let j=o*14*m+x*2,K=0,oe=c,S=[],G=z;for(let B=0;B<u;B++){K>=I&&(K=0,c=oe,L+=j,b+=j,h+=j);let P=e==null?void 0:e.blocks[B];c+=U;let X=q(G,P);S.push(X),G=X.mlpResidual,c+=U,K++}c+=U;let V=R(0,G,e==null?void 0:e.ln_f);p.push(...V.cubes);let Ue=!1,he,se,we,Fe,qe;{c+=o*m+x;let B=b-r*m-x;he=v({t:"w",cx:o,cy:n,cz:1,y:c,xR:B,zM:0,access:{src:e==null?void 0:e.lm_head.weight,x:[1,0,0],y:[0,1,0],scale:5},dimX:w.C,dimY:w.n_vocab,name:"LM Head Weights"}),se=v({t:"i",cx:r,cy:n,cz:l,y:c,xR:b,zM:0,access:{src:e==null?void 0:e.lm_head.output,x:[0,1,0],y:[1,0,r]},deps:{dot:[[he,"iy"],[V.lnResid,"xi"]],dotLen:o},dimX:w.T,dimY:w.n_vocab,name:"Logits"}),c+=n*m+x,Fe=v({t:"a",cx:r,cy:1,cz:l,y:c,xR:b,zM:0,access:{src:e==null?void 0:e.softmaxFinal.agg,x:[0,1,0],y:[1,0,r],channel:"g"},deps:{add:[[se,"xi"]],special:7},dimX:w.T,dimY:w.None,name:"SM Agg"}),we=v({t:"a",cx:r,cy:1,cz:l,y:c+m,xR:b,zM:0,access:{src:e==null?void 0:e.softmaxFinal.agg,x:[0,1,0],y:[1,0,r],channel:"r"},deps:{add:[[se,"xi"],[Fe,"x0"]],special:8},dimX:w.T,dimY:w.None,name:""}),c+=2*m+x,qe=v({t:"i",cx:r,cy:n,cz:l,y:c,xR:b,zM:0,access:{src:e==null?void 0:e.softmaxFinal.output,x:[0,1,0],y:[1,0,r]},deps:{add:[[se,"xy"],[we,"xi"],[Fe,"xi"]],special:1},dimX:w.T,dimY:w.n_vocab,name:"Logits Softmax"})}let Ir=n*o+r*o+u*(2*o+4*o*o+o+3*o+(2*o+4*o+8*o*o+o))+2*o;p.push(he,se,we,Fe,qe);for(let B=0;B<p.length;B++)p[B].idx=B;return{cubes:p,cell:m,margin:x,idxObj:_,tokEmbedObj:g,posEmbedObj:A,residual0:z,ln_f:V,lmHeadWeight:he,logits:se,logitsAgg1:we,logitsAgg2:Fe,logitsSoftmax:qe,embedLabel:F,blocks:S,height:c,logitsTransposed:Ue,model:e,labels:[F,...S.flatMap(B=>B.labels)],weightCount:Ir,shape:i,extraSources:{idx:e==null?void 0:e.inputBuf,tokEmbedOut:e==null?void 0:e.vocabEmbed.output,posEmbedOut:e==null?void 0:e.posEmbed.output}}}function ft(i){if(!i)return null;let e=i.gl,t=`
    layout (std140) uniform BlockUbo {
        uniform vec3 u_offset;
        uniform vec3 u_size;
        uniform vec3 u_nCells;
        uniform mat4 u_localPosMtx;
        uniform vec4 u_baseColor;
        uniform float u_highlight;
    };`,l=`
    layout (std140) uniform BlockAccessUbo {
        layout(row_major) uniform mat4x2 u_accessMtx;
        uniform float u_accessTexChannel;
        uniform float u_accessTexScale;
    };`,r=1024,n=Ee(e,e.UNIFORM_BUFFER,e.createBuffer(),r,144,null),a=Ee(e,e.UNIFORM_BUFFER,e.createBuffer(),r,80,null),u=Ql(e),f=e.createVertexArray();e.bindVertexArray(f),e.bindBuffer(e.ARRAY_BUFFER,u.vbo),Be(e,u.vbo,{},[{name:"a_position",size:3},{name:"a_normal",size:3}]);let c=e.createBuffer(),m=Be(e,c,{locOffset:2,divisor:1},[{name:"a_offset",size:4},{name:"a_size",size:4},{name:"a_nCells",size:4},{name:"a_localPosMtx0",size:4},{name:"a_localPosMtx1",size:4},{name:"a_localPosMtx2",size:4},{name:"a_localPosMtx3",size:4},{name:"a_baseColor",size:4},{name:"a_highlight",size:1}]),x=Ee(e,e.ARRAY_BUFFER,c,1024,m,null),v=e.createTexture();e.bindTexture(e.TEXTURE_2D,v),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,new Uint8Array([0,0,0,0])),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);function d(g){return`#version 300 es
        precision highp float;

        ${Te}

        ${g?"":t}

        ${l}

        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;
        out vec3 v_normal;
        out vec3 v_modelPos;
        out vec3 v_blockPos;
        out vec2 v_accessPos;
        out vec3 v_cubePos;

        ${g?`
            layout(location = 2) in vec4 a_offset;
            layout(location = 3) in vec4 a_size;
            layout(location = 4) in vec4 a_nCells;
            layout(location = 5) in vec4 a_localPosMtx0;
            layout(location = 6) in vec4 a_localPosMtx1;
            layout(location = 7) in vec4 a_localPosMtx2;
            layout(location = 8) in vec4 a_localPosMtx3;
            layout(location = 9) in vec4 a_baseColor;
            layout(location = 10) in float a_highlight;

            out vec4 u_baseColor;
            out float u_highlight;
        `:""}

        void main() {
            ${g?`
                vec3 u_offset = a_offset.xyz;
                vec3 u_size = a_size.xyz;
                vec3 u_nCells = a_nCells.xyz;
                mat4 u_localPosMtx = mat4(a_localPosMtx0, a_localPosMtx1, a_localPosMtx2, a_localPosMtx3);
                u_baseColor = a_baseColor;
                u_highlight = a_highlight;
            `:""}

            vec3 localPos = (u_localPosMtx * vec4(a_position, 1.0)).xyz;
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
            v_normal = a_normal;
            v_modelPos = model_pos;
            v_blockPos = localPos * u_nCells;
            v_accessPos = u_accessMtx * vec4(v_blockPos, 1.0);
            v_cubePos = localPos;
            ${g?" ":""}
        }`}function p(g){return`#version 300 es
        precision highp float;
        in vec3 v_normal;
        out vec4 o_color;
        in vec3 v_blockPos;
        in vec3 v_cubePos;
        in vec3 v_modelPos;
        in vec2 v_accessPos;
        uniform vec3 u_camPos; // in model space

        ${g?`
            in vec4 u_baseColor;
            in float u_highlight;
        `:t}

        ${l}

        uniform sampler2D u_accessSampler;

        void main() {
            ivec3 blockPos = ivec3(v_blockPos - v_normal * 0.1);

            bool cellDark = (blockPos.x + blockPos.y + blockPos.z) % 2 == 0;

            float maxDist = 4000.0;
            float minDist = 600.0;
            float dist = distance(u_camPos, v_modelPos);
            float t = clamp((dist - minDist) / (maxDist - minDist), 0.0, 1.0);

            vec3 baseColor = mix(u_baseColor.rgb, vec3(0.5, 0.5, 0.5), 0.5);
            if (cellDark) {
                baseColor *= mix(0.9, 1.0, t);
            }

            if (u_accessTexScale > 0.0 && dist < maxDist) { // have access texture
                vec3 texBaseColor = mix(baseColor, vec3(0.5, 0.5, 0.5), 0.8);

                vec3 d = fract(v_blockPos) - 0.5;
                float r2 = 0.3*0.3;
                bool insideX = d.y * d.y + d.z * d.z < r2;
                bool insideY = d.x * d.x + d.z * d.z < r2;
                bool insideZ = d.x * d.x + d.y * d.y < r2;
                bool insideAny = insideX || insideY || insideZ;

                if (insideAny) {
                    ivec2 accessPos = ivec2(u_accessMtx * vec4(blockPos, 1.0));
                    vec4 valVec = texelFetch(u_accessSampler, accessPos, 0) * u_accessTexScale;
                    float val = u_accessTexChannel == 0.0 ? valVec.r : u_accessTexChannel == 1.0 ? valVec.g : valVec.b;

                    float weight = clamp(abs(val), 0.0, 1.0);

                    vec3 negColor = vec3(0.0, 0.0, 0.0);
                    vec3 posColor = u_baseColor.rgb; // vec3(0.0, 1.0, 0.0);
                    vec3 zeroColor = vec3(0.5, 0.5, 0.5);
                    texBaseColor = mix(mix(zeroColor, negColor, weight), mix(zeroColor, posColor, weight), step(0.0, val));
                }

                baseColor = mix(texBaseColor, baseColor, t);
            }

            if (true) {
                vec3 block16 = v_blockPos / 16.0;
                vec3 pxPerBlock16 = 1.0 / fwidth(block16);
                float strength16 = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                vec3 colorEdge = vec3(1.0, 1.0, 1.0);
                vec3 color16 = vec3(1.0, 1.0, 1.0) * 0.7;
                vec3 color256 = vec3(1.0, 1.0, 1.0);

                // if we're zoomed out enough, show 256 & (256 * 16) grid lines
                // the 16 grid lines are faded out by this point (fade out between 10px -> 1px)
                if (strength16 < 2.0) {
                    block16 = block16 / 16.0;
                    pxPerBlock16 = 1.0 / fwidth(block16);
                    strength16 = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                    color16 = color256;
                    // orange
                    color256 = vec3(1.0, 0.7, 0.4);
                }

                float visibility16 = smoothstep(2.0, 10.0, strength16); // below 10px between lines, fade out
                vec3 block16Grid = 1.0 - abs(fract(block16 - 0.5) - 0.5) * pxPerBlock16;
                float line16 = max(max(block16Grid.x, block16Grid.y), block16Grid.z) * visibility16;

                vec3 block256 = block16 / 16.0;
                vec3 block256Grid = 1.0 - abs(fract(block256 - 0.5) - 0.5) / fwidth(block256);
                float line256 = max(max(block256Grid.x, block256Grid.y), block256Grid.z);

                vec3 cube = v_cubePos - v_normal * 0.1;
                vec3 cubeGrid = 1.0 - abs(fract(cube - 0.5) - 0.5) / fwidth(cube);
                float lineCube = max(max(cubeGrid.x, cubeGrid.y), cubeGrid.z);

                float bestPxPerBlock = min(min(pxPerBlock16.x, pxPerBlock16.y), pxPerBlock16.z);
                float edgeWeight = smoothstep(0.0, 1.0, max(max(line16, lineCube), line256));
                vec3 color = lineCube > 0.0 ? colorEdge : (line256 > 0.0 ? color256 : color16);
                baseColor = mix(baseColor, color, edgeWeight);
            }

            vec3 color = mix(baseColor * 0.7, u_baseColor.rgb, u_highlight);

            o_color = vec4(color, 1) * u_baseColor.a;
        }`}let _=W(i,"block",d(!1),p(!1),["u_camPos","u_accessSampler"],{uboBindings:{ModelViewUbo:Q.ModelView,BlockUbo:Q.Block,BlockAccessUbo:Q.BlockAccess}}),b=W(i,"block-instanced",d(!0),p(!0),["u_camPos","u_accessSampler"],{uboBindings:{ModelViewUbo:Q.ModelView,BlockAccessUbo:Q.BlockAccess}}),h=W(i,"block-simple",`#version 300 es
        precision highp float;
        ${Te}
        uniform vec3 u_size;
        uniform vec3 u_offset;

        layout(location = 0) in vec3 a_position;
        void main() {
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
        }
    `,`#version 300 es
        precision highp float;
        out vec4 o_color;
        uniform vec4 u_baseColor;

        void main() {
            o_color = u_baseColor;
        }
    `,["u_size","u_offset","u_baseColor"],{uboBindings:{ModelViewUbo:Q.ModelView}});return{gl:e,cubeGeom:u,shader:_,simpleShader:h,blockUbo:n,blockAccessUbo:a,dummyTexture:v,instancedShader:b,instancedVao:f,instancedFloatBuf:x,instancedDataStale:!0,instancedNumBlocks:0}}function Ql(i){let e=[-1,1,-1,-1,1,1,1,1,-1,-1,1,-1],t=[new D,D.fromAxisAngle(new y(1,0),Math.PI/2),D.fromAxisAngle(new y(1,0),Math.PI),D.fromAxisAngle(new y(1,0),-Math.PI/2),D.fromAxisAngle(new y(0,1),Math.PI/2),D.fromAxisAngle(new y(0,1),-Math.PI/2)],l=D.fromTranslation(new y(.5,.5,.5)).mul(D.fromScale(new y(.5,.5,.5))),r=new Float32Array(216),o=0;for(let a of t)for(let u=0;u<6;u++){let f=l.mulVec3Proj(a.mulVec3Proj(new y(e[u*2],e[u*2+1],-1))),c=a.mulVec3Proj(new y(0,0,-1));r[o++]=Math.round(f.x),r[o++]=Math.round(f.y),r[o++]=Math.round(f.z),r[o++]=c.x,r[o++]=c.y,r[o++]=c.z}let n=i.createVertexArray();i.bindVertexArray(n);let s=i.createBuffer();return i.bindBuffer(i.ARRAY_BUFFER,s),i.bufferData(i.ARRAY_BUFFER,r,i.STATIC_DRAW),Be(i,s,{},[{name:"a_position",size:3},{name:"a_normal",size:3}]),{name:"cube",vao:n,vbo:s,type:i.TRIANGLES,numVerts:36}}function Zl(i,e){let t=i.gl;if(!i.simpleShader.ready)return;let l=i.simpleShader.locs,r=i.cubeGeom;t.useProgram(i.simpleShader.program),t.bindVertexArray(r.vao);for(let o of e){t.uniform3f(l.u_size,o.dx,o.dy,o.dz),t.uniform3f(l.u_offset,o.x,o.y,o.z);let n=(o.t==="w"?_e.Weights:new C(.4,.8,.4,1)).mul(o.highlight);t.uniform4f(l.u_baseColor,n.x,n.y,n.z,n.w),t.drawArrays(r.type,0,r.numVerts)}}function Jl(i,e,t,l,r,o){let n=i.gl,s=i.shader.locs,a=i.cubeGeom;if(!i.shader.ready)return;n.useProgram(i.shader.program);let u=t.mulVec3Proj(l);n.uniform3f(s.u_camPos,u.x,u.y,u.z),n.uniform1i(s.u_accessSampler,0),n.enable(n.BLEND),n.enable(n.CULL_FACE),n.activeTexture(n.TEXTURE0),n.bindVertexArray(a.vao);let f=[],c=[];function m(h){h.subs?h.subs.forEach(m):h.opacity<.8&&h.opacity>0?c.push(h):h.opacity>0&&f.push(h)}e.cubes.forEach(m);let x=[...f,...c],v=f.length,d=i.blockUbo.localBufs[0],p=i.blockAccessUbo.localBufs[0];{Me(i.blockUbo),ye(d,f.length);let h=d.buf;for(let g of x){let A=d.usedEls*d.strideFloats;h[A+0]=g.x,h[A+1]=g.y,h[A+2]=g.z,h[A+4]=g.dx,h[A+5]=g.dy,h[A+6]=g.dz,h[A+8]=g.cx,h[A+9]=g.cy,h[A+10]=g.cz,h.set(g.localMtx??new D,A+12);let z=g.t==="w"?_e.Weights:g.t==="i"?_e.Intermediates:_e.Aggregates;new C(z.x,z.y,z.z,g.opacity).writeToBuf(h,A+28),h[A+32]=g.highlight,d.usedEls+=1}Re(n,i.blockUbo)}{Me(i.blockAccessUbo),ye(p,f.length);let h=p.buf;for(let g of x){let A=p.usedEls*p.strideFloats;if(g.access&&g.access.disable!==!0){h.set(g.access.mat.slice(0,8),A);let z=g.access.channel;h[A+8]=z==="r"?0:z==="g"?1:z==="b"?2:3,h[A+9]=g.access.scale}else h[A+9]=0;p.usedEls+=1}Re(n,i.blockAccessUbo)}let _=!0,b=0;for(let h of x){b===v&&n.depthMask(!1),n.bindBufferRange(n.UNIFORM_BUFFER,Q.Block,i.blockUbo.buf,b*d.strideBytes,d.strideBytes);let g=!!h.access&&h.access.disable!==!0;(_||g)&&(n.bindBufferRange(n.UNIFORM_BUFFER,Q.BlockAccess,i.blockAccessUbo.buf,b*p.strideBytes,p.strideBytes),n.bindTexture(n.TEXTURE_2D,g&&h.access?h.access.src.texture:i.dummyTexture),_=g),n.drawArrays(a.type,0,a.numVerts),b++}n.depthMask(!0)}function Kl(i,e,t,l){if(!i.instancedShader.ready)return;let r=i.gl,o=i.instancedShader.locs,n=i.blockAccessUbo.localBufs[0];r.useProgram(i.instancedShader.program);let a=t.invert().mulVec3Proj(l);if(r.uniform3f(o.u_camPos,a.x,a.y,a.z),r.uniform1i(o.u_accessSampler,0),r.enable(r.BLEND),r.enable(r.CULL_FACE),r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,i.dummyTexture),r.bindVertexArray(i.instancedVao),i.instancedDataStale){i.instancedDataStale=!1;{Me(i.instancedFloatBuf);let u=i.instancedFloatBuf.localBufs[0];ye(u,e.cubes.length);let f=u.buf;for(let c of e.cubes){if(c.small)continue;let m=u.usedEls*u.strideFloats;f[m+0]=c.x,f[m+1]=c.y,f[m+2]=c.z,f[m+4]=c.dx,f[m+5]=c.dy,f[m+6]=c.dz,f[m+8]=c.cx,f[m+9]=c.cy,f[m+10]=c.cz,f.set(c.localMtx??new D,m+12);let x=c.t==="w"?_e.Weights:c.t==="i"?_e.Intermediates:_e.Aggregates;new C(x.x,x.y,x.z,c.opacity).writeToBuf(f,m+28),f[m+32]=c.highlight,u.usedEls+=1}Re(r,i.instancedFloatBuf),i.instancedNumBlocks=u.usedEls}{Me(i.blockAccessUbo),ye(n,1);let u=n.buf;u[9]=0,n.usedEls+=1,Re(r,i.blockAccessUbo)}}r.bindBufferRange(r.UNIFORM_BUFFER,Q.BlockAccess,i.blockAccessUbo.buf,0,n.strideBytes),r.drawArraysInstanced(i.cubeGeom.type,0,i.cubeGeom.numVerts,i.instancedNumBlocks),r.depthMask(!0)}function er(i,e){let t=i.gl,l=Math.max(t.canvas.width,1),r=Math.max(t.canvas.height,1),o=t.createFramebuffer(),n=t.createTexture();t.bindFramebuffer(t.FRAMEBUFFER,o),t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,l,r,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,n,0);function s(){let h=t.createFramebuffer(),g=t.createTexture();t.bindFramebuffer(t.FRAMEBUFFER,h),t.bindTexture(t.TEXTURE_2D,g),t.texImage2D(t.TEXTURE_2D,0,t.RGBA,l,r,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,g,0);{let A=t.checkFramebufferStatus(t.FRAMEBUFFER);A!==t.FRAMEBUFFER_COMPLETE&&console.log(`Blur framebuffer not complete: ${A.toString(16)}`)}return{fbo:h,tex:g}}let a=[s(),s()],u=4,f=2,c=new Float32Array((u*2+1)*4),m=0,x=u/2;for(let h=-u;h<=u;h++){let g=h/x,A=Math.exp(-g*g*.5),z=h+u;c[z*4]=A,m+=A}for(let h=0;h<u*2+1;h++)c[h*4]/=m;let v=t.createBuffer();t.bindBuffer(t.UNIFORM_BUFFER,v),t.bufferData(t.UNIFORM_BUFFER,c.buffer,t.STATIC_DRAW),t.bindBufferBase(t.UNIFORM_BUFFER,Q.blur,v);function d(h,g){return W(i.shaderManager,h,`#version 300 es
            precision highp float;
            layout(location = 0) in vec2 a_position;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
            }
        `,`#version 300 es
            precision highp float;

            layout(std140) uniform BlurWeights {
                float weights[${u*2+1}];
            };

            uniform sampler2D u_texture;
            out vec4 o_color;

            void main() {
                ivec2 pos = ivec2(gl_FragCoord.xy);
                vec4 color = vec4(0);
                vec4 center = texelFetch(u_texture, pos, 0);
                for (int i = -${u}; i <= ${u}; i++) {
                    int wId = i + ${u};
                    color += texelFetch(u_texture, pos + ivec2(${g===T.X?"i, 0":"0, i"}) * ${f}, 0) * weights[wId];
                }
                o_color = max(color, center);
            }
        `,["u_texture"],{uboBindings:{BlurWeights:Q.blur}})}let p=d("blurHoriz",T.X),_=d("blurVert",T.Y),b=W(i.shaderManager,"blurOverlay",`#version 300 es
            precision highp float;
            layout(location = 0) in vec2 a_position;
            out vec2 v_uv;
            void main() {
                gl_Position = vec4(a_position, 0, 1);
                v_uv = a_position * 0.5 + 0.5;
            }
        `,`#version 300 es
            precision highp float;
            uniform sampler2D u_texture;
            uniform sampler2D u_initTexture;
            in vec2 v_uv;
            out vec4 o_color;

            void main() {
                ivec2 pos = ivec2(gl_FragCoord.xy);
                vec4 blurColor = texture(u_texture, v_uv);
                // vec4 initColor = texture(u_initTexture, v_uv);

                vec4 base = vec4(0.9, 0.9, 0.9, 0.1);
                // if (blurColor.a == 0.0) {
                //     blurColor = vec4(0.1, 0.1, 0.1, 1.0);
                // }
                o_color = blurColor; // + initColor * (1.0 - blurColor.a);
                // o_color = initColor;
            }
        `,["u_texture"]);return{gl:t,quadVao:e,initialFbo:o,initialTex:n,blurFbos:a,horizShader:p,vertShader:_,overlayShader:b,currViewSize:new y(0,0),blurFactor:.3}}function tr(i){let e=i.gl,t=e.canvas.width,l=e.canvas.height,r=Math.floor(t*i.blurFactor),o=Math.floor(l*i.blurFactor);if(i.currViewSize.x!==t||i.currViewSize.y!==l){e.bindTexture(e.TEXTURE_2D,i.initialTex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,o,0,e.RGBA,e.UNSIGNED_BYTE,null);for(let n of i.blurFbos)e.bindTexture(e.TEXTURE_2D,n.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,r,o,0,e.RGBA,e.UNSIGNED_BYTE,null);i.currViewSize=new y(t,l)}e.bindFramebuffer(e.FRAMEBUFFER,i.initialFbo),e.viewport(0,0,r,o),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT)}function ir(i,e){let t=i.gl,l=t.canvas.width,r=t.canvas.height,o=Math.floor(l*i.blurFactor),n=Math.floor(r*i.blurFactor);t.bindVertexArray(i.quadVao),t.disable(t.DEPTH_TEST),t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.STENCIL_TEST),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,i.initialTex),t.bindFramebuffer(t.FRAMEBUFFER,i.blurFbos[0].fbo),t.viewport(0,0,o,n),t.useProgram(i.horizShader.program),t.uniform1i(i.horizShader.locs.u_texture,0),t.drawArrays(t.TRIANGLE_FAN,0,4),t.bindTexture(t.TEXTURE_2D,i.blurFbos[0].tex),t.bindFramebuffer(t.FRAMEBUFFER,i.blurFbos[1].fbo),t.viewport(0,0,o,n),t.useProgram(i.vertShader.program),t.uniform1i(i.vertShader.locs.u_texture,0),t.drawArrays(t.TRIANGLE_FAN,0,4),t.enable(t.BLEND),t.viewport(0,0,l,r),t.bindFramebuffer(t.FRAMEBUFFER,e),t.bindTexture(t.TEXTURE_2D,i.blurFbos[1].tex),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,i.initialTex),t.useProgram(i.overlayShader.program),t.uniform1i(i.overlayShader.locs.u_texture,0),t.drawArrays(t.TRIANGLE_FAN,0,4)}function lr(i){let e=i.gl,t=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,t),e.bufferData(e.ARRAY_BUFFER,new Float32Array([0,1,0,1,1,0,1,0,0,0,0,0]),e.STATIC_DRAW);let l=e.createVertexArray();e.bindVertexArray(l),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,0,0);let r=e.createBuffer(),o=Be(e,r,{divisor:1,locOffset:2},[{name:"a_offset",size:3},{name:"a_size",size:3},{name:"a_nCells",size:2},{name:"a_threadDir",size:2,nCols:3}]),n=Ee(e,e.ARRAY_BUFFER,r,1024,o,null),s=W(i,"thread",`#version 300 es
        precision highp float;
        ${Te}
        layout(location = 0) in vec3 a_position;
        layout(location = 1) in vec3 a_normal;

        uniform vec3 u_offset;
        uniform vec3 u_size;
        uniform vec2 u_nCells;
        uniform mat3x2 u_threadDir;
        out vec3 v_normal;
        out vec3 v_modelPos;
        out vec2 v_blockPos;
        out vec2 v_squarePos;
        void main() {
            vec2 localPos = u_threadDir * vec3(a_position.xy, 1);
            vec3 model_pos = a_position * u_size + u_offset;
            gl_Position = u_view * u_model * vec4(model_pos, 1);
            v_normal = a_normal;
            v_modelPos = model_pos;
            v_blockPos = localPos * abs(u_threadDir * vec3(u_nCells, 0));
            v_squarePos = localPos;
        }
    `,`#version 300 es
        precision highp float;
        in vec3 v_normal;
        in vec3 v_modelPos;
        in vec2 v_blockPos;
        in vec2 v_squarePos;
        out vec4 o_color;
        uniform vec2 u_nCells;
        uniform vec3 u_camPos; // in model space
        uniform vec3 u_baseColor;

        void main() {
            ivec2 blockPos = ivec2(v_blockPos - v_normal.xy * 0.0);

            vec2 pxPerCell = 1.0 / fwidth(v_blockPos);
            float maxPxPerCell = max(pxPerCell.x, pxPerCell.y);

            vec4 color = vec4(0);

            if (v_blockPos.y < 0.0) {
                discard;
            }

            if (blockPos.y == 0) {
                // draw head
                vec2 d = fract(v_blockPos) - 0.5;
                float d2 = sqrt(d.x * d.x + d.y * d.y);

                // fwidth(d);
                float deltad2_per_px = fwidth(d2); // fwidth(d2);

                float t = 1.0 - smoothstep(0.45, 0.45 + 1.0 * deltad2_per_px, d2);

                float t2 = smoothstep(0.35, 0.35 + 1.0 * deltad2_per_px, d2);

                // if (d2 > 0.35 && d2 < 0.45) {
                color = mix(color, vec4(u_baseColor, 1), min(t, t2));
                // }
            }

            if (v_blockPos.y > (0.5 + 0.45)) {
                float falloffY = 1.0 - clamp(v_blockPos.y / 10.0, 0.0, 1.0);

                float cellPosX = fract(v_blockPos.x);
                float distFromX = abs(cellPosX - 0.5);
                // small side-to-side falloff based on distFromX for a glow effect
                float falloffX = 1.0 - smoothstep(0.0, min(0.3, 5.0 * fwidth(v_blockPos.x)), distFromX);

                color = mix(color, vec4(u_baseColor, 1), falloffX * falloffY);
            }

            // color = vec4(1, 0, 0, 1);

            o_color = color;
        }
    `,["u_size","u_offset","u_baseColor","u_nCells","u_threadDir"],{uboBindings:{ModelViewUbo:Q.ModelView}});return{gl:e,vao:l,quadVbo:t,instanceVbo:r,instanceBuf:n,numInstances:0,shader:s,threadInfos:[]}}function rr(i){let{gl:e,shader:t,vao:l}=i;e.enable(e.POLYGON_OFFSET_FILL),e.disable(e.CULL_FACE),e.depthMask(!1),e.polygonOffset(-1,-2);let r=t.locs;e.useProgram(t.program),e.bindVertexArray(l);for(let o of i.threadInfos){let n=o.baseColor;e.uniform3f(r.u_offset,o.pos.x,o.pos.y,o.pos.z),e.uniform3f(r.u_size,o.size.x,o.size.y,o.size.z),e.uniform2f(r.u_nCells,o.nCells.x,o.nCells.y),e.uniform3f(r.u_baseColor,n.x,n.y,n.z),e.uniformMatrix3x2fv(r.u_threadDir,!1,o.threadDir),e.drawArrays(e.TRIANGLE_FAN,0,4)}i.threadInfos=[],e.disable(e.POLYGON_OFFSET_FILL),e.depthMask(!0)}function or(i){var e;return{ctx:i,queries:new Map,TIME_ELAPSED_EXT:(e=i.ext.disjointTimerQuery)==null?void 0:e.TIME_ELAPSED_EXT}}function nr(i,e){if(!i.ctx.ext.disjointTimerQuery)return null;let t=i.queries.get(e);if(!t){let o=i.ctx.gl.createQuery();i.queries.set(e,t={query:o,hasRun:!1,hasStarted:!1})}let l=!1;t.hasRun&&(l=i.ctx.gl.getQueryParameter(t.query,i.ctx.gl.QUERY_RESULT_AVAILABLE));let r=null;return l&&(r=i.ctx.gl.getQueryParameter(t.query,i.ctx.gl.QUERY_RESULT)/1e6),(!t.hasRun||l)&&(i.ctx.gl.beginQuery(i.TIME_ELAPSED_EXT,t.query),t.hasRun=!0,t.hasStarted=!0),r}function sr(i,e){if(!i.ctx.ext.disjointTimerQuery)return;let t=i.queries.get(e);t&&t.hasRun&&t.hasStarted&&(i.ctx.gl.endQuery(i.TIME_ELAPSED_EXT),t.hasStarted=!1)}function ar(i,e){let t=i.getContext("webgl2",{antialias:!0});if(!t)return null;let l={colorBufferFloat:t.getExtension("EXT_color_buffer_float"),disjointTimerQuery:t.getExtension("EXT_disjoint_timer_query_webgl2")};l.colorBufferFloat||console.log("initRender: EXT_color_buffer_float not supported: floating point textures will not work."),l.disjointTimerQuery||console.log("initRender: EXT_disjoint_timer_query_webgl2 not supported: GPU timing will not work.");let r=Gi(t),o={gl:t,shaderManager:r,ext:l},n=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,n),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,1,1,-1,1]),t.STATIC_DRAW);let s=t.createVertexArray();t.bindVertexArray(s),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,2,t.FLOAT,!1,0,0);let a=al(o),u=fl(o,e),f=ml(u,a),c=lr(o),m=zl(o,a),x=ft(o),v=Pl(o,a),d=er(o,s),p=or(o);return kt(r),{canvasEl:i,gl:t,ctx:o,blockRender:x,threadRender:c,lineRender:m,blurRender:d,triRender:v,sharedRender:a,fontAtlas:u,modelFontBuf:f,quadVao:s,queryManager:p,syncObjects:[],size:new y(1,1),lastGpuMs:0,lastJsMs:0,renderTiming:!1}}function cr(i){Fl(i.lineRender),vl(i.modelFontBuf),Ll(i.triRender)}function ur(i){let{layout:e,render:t,camera:l}=i,{gl:r,blockRender:o,size:n}=t,{modelMtx:s,viewMtx:a}=l,{camPos:u}=Vt(l),f=[new y(100,400,600),new y(-200,-300,-300),new y(200,-100,0)],c=[new y(1,.2,.2),new y(1,.2,.2),new y(1,.2,.2)],m=new Float32Array(9),x=new Float32Array(9);for(let p=0;p<3;p++)s.mulVec3Proj(f[p]).writeToBuf(m,p*3),s.mulVec3Proj(c[p]).writeToBuf(x,p*3);if(r.bindFramebuffer(r.FRAMEBUFFER,null),r.viewport(0,0,n.x,n.y),r.clearColor(0,0,0,0),r.clear(r.COLOR_BUFFER_BIT|r.DEPTH_BUFFER_BIT),r.enable(r.BLEND),r.blendFunc(r.ONE,r.ONE_MINUS_SRC_ALPHA),r.enable(r.DEPTH_TEST),r.enable(r.CULL_FACE),r.cullFace(r.FRONT),r.frontFace(r.CW),t.renderTiming){let p=`GPU: ${t.lastGpuMs.toFixed(1)}ms JS: ${t.lastJsMs.toFixed(1)}ms`,_=n.x,b=14;t.sharedRender.activePhase=ee.Overlay2D;let h=hi(t.modelFontBuf,p,b);xi(t.modelFontBuf,p,new C(0,0,0,1),_-h-4,4,b,new D)}tt(t.sharedRender,s,a);{let p=e.cubes.filter(_=>_.highlight>0);tr(t.blurRender),Zl(o,p),ir(t.blurRender,null)}r.enable(r.DEPTH_TEST),Rl(t.lineRender),Cl(t.triRender),hl(t.modelFontBuf),Jl(o,e,s,u),t.sharedRender.activePhase=ee.Opaque;for(let p of i.examples)if(p.enabled&&p.layout){let{modelMtx:_,viewMtx:b}=l,{camPos:h}=Vt(l);var v=_.mul(D.fromTranslation(p.offset));tt(t.sharedRender,v,b),Kl(p.blockRender,p.layout,v,h)}tt(t.sharedRender,s,a),rr(t.threadRender),r.polygonOffset(-1,-2);let d=[ee.Opaque,ee.Arrows,ee.Overlay,ee.Overlay2D];for(let p of d){if(p===ee.Overlay2D){let _=n.x,b=n.y;r.clear(r.DEPTH_BUFFER_BIT),tt(t.sharedRender,new D,D.fromOrtho(0,_,b,0,-1,1))}p===ee.Overlay||p===ee.Overlay2D?r.enable(r.POLYGON_OFFSET_FILL):r.disable(r.POLYGON_OFFSET_FILL),Il(t.triRender,p),xl(t.modelFontBuf,p),Ml(t.lineRender,p)}r.disable(r.POLYGON_OFFSET_FILL)}let fr={state:null};function mr(){return{name:"Nano-GPT Visualization",phases:[],phaseLength:0,phaseIdx:0,time:0,dt:0,running:!1,commentary:null,times:[],prevPhaseIdx:0,prevTime:0,markDirty:()=>{}}}function dr(i,e,t){return null}function hr(i){let e=i.mouse,t=i.render.size,l=e.mousePos.x/t.x*2-1,r=1-e.mousePos.y/t.y*2,n=i.camera.viewMtx.invert(),a=i.camera.modelMtx.invert();function u(h){let g=n.mulVec4(h);return a.mulVec4(g).projToVec3()}let f=new C(l,r,-1,1),c=new C(l,r,1,1),m=u(f),v=u(c).sub(m).normalize(),d=[];function p(h,g){if(h.subs)for(let A of h.subs)p(A,g||h);else h.opacity>0&&d.push([h,g])}for(let h of i.layout.cubes)p(h,h);let _=0,b=null;for(let[h,g]of d){let A=new y(h.x,h.y,h.z),z=new y(h.x+h.dx,h.y+h.dy,h.z+h.dz),F=yr(A,z,m,v);F>0&&(!b||F<_)&&(_=F,b=[h,g])}if(b){let[h,g]=b,A=new y(h.x,h.y,h.z),z=m.add(v.mul(_)),F=new y(Oe((z.x-A.x)/h.dx,0,1-.1/h.cx),Oe((z.y-A.y)/h.dy,0,1-.1/h.cy),Oe((z.z-A.z)/h.dz,0,1-.1/h.cz)),R=h.localMtx?h.localMtx.mulVec3Proj(F):F,L=new y(Math.floor(R.x*h.cx),Math.floor(R.y*h.cy),Math.floor(R.z*h.cz));i.display.hoverTarget={mainCube:g,subCube:h,mainIdx:L};for(let q of i.layout.labels)for(let U of q.cubes)U===g&&(q.visible=1);ct(i,i.layout,g,T.X,g.dimX,1),ct(i,i.layout,g,T.Y,g.dimY,1),xr(i,g,h,F),pr(i,g,L)}else if(Ke(i.display.blkIdxHover))for(let h of i.display.blkIdxHover){let g=i.layout.cubes[h];Gt(g,A=>{A.highlight=.2})}if(Ke(i.display.dimHover)){let h=i.walkthrough.dimHighlightBlocks;for(let g of h??[])g.dimX===i.display.dimHover&&ct(i,i.layout,g,T.X,g.dimX,1),g.dimY===i.display.dimHover&&ct(i,i.layout,g,T.Y,g.dimY,1)}}function Gt(i,e){if(i.subs)for(let t of i.subs)Gt(t,e);else e(i)}function xr(i,e,t,l){if(Gt(e,r=>{r.highlight=.1}),t===e){let r=new y(l.x*t.cx*t.dx/e.dx,l.y*t.cy*t.dy/e.dy,l.z*t.cz*t.dz/e.dz),o=De(i.layout,t,T.X,r.x);if(o){o.highlight=.15;let n=De(i.layout,o,T.Y,r.y);if(n){let s=De(i.layout,n,T.Z,r.z);s&&(s.highlight=.6)}}}}function Ei(i,e){let t=i.srcIdxMtx,l=t.g(0,3)!==0,r=t.g(1,3)!==0,o=t.mulVec4(C.fromVec3(e,0)),n=new y(o.x,o.y,o.z),s=l?T.Y:T.X;return{srcIdx:n,dotDim:s,otherDim:s===T.X?T.Y:T.X,isDot:l||r}}function vr(i,e){var r;if(!((r=i.deps)!=null&&r.dot))return null;let t=null,l=i.deps.dot.find(o=>{var n;return(n=o.src.deps)==null?void 0:n.lowerTri});if(l){let{srcIdx:o,dotDim:n}=Ei(l,e);t=o.getAt(n)}return t}function pr(i,e,t){let l=i.layout,r=e.deps;if(!r)return;function o(n,s,a){var x,v;let{srcIdx:u,dotDim:f,otherDim:c,isDot:m}=Ei(n,s);if(((x=e.deps)==null?void 0:x.special)===zi.InputEmbed&&n.src===i.layout.tokEmbedObj&&(dr(i.layout.idxObj,new y(s.x,0,s.z)),m=!1,u.setAt(T.X,0)),m){(v=n.src.deps)!=null&&v.lowerTri&&(a=a??u.getAt(f));let d=ut(l,n.src,f,u.getAt(f));if(d&&Ke(a)){De(l,d,c,a);for(let p of ql(d,c,null,a))p.highlight=.5}else d&&(d.highlight=.5)}else{let d=ut(l,n.src,T.X,u.x);if(!d||(d=ut(l,d,T.Y,u.y),!d))return;d=ut(l,d,T.Z,u.z),d&&(d.highlight=.5)}}if(r.dot){let n=vr(e,t);for(let s of r.dot)o(s,t,n)}if(r.add)for(let n of r.add)o(n,t)}function yr(i,e,t,l){let r=(i.x-t.x)/l.x,o=(e.x-t.x)/l.x,n=Math.min(r,o),s=Math.max(r,o),a=(i.y-t.y)/l.y,u=(e.y-t.y)/l.y;n=Math.max(n,Math.min(a,u)),s=Math.min(s,Math.max(a,u));let f=(i.z-t.z)/l.z,c=(e.z-t.z)/l.z;return n=Math.max(n,Math.min(f,c)),s=Math.min(s,Math.max(f,c)),s>=n?n:-1}function gr(i,e){let t=i?i.replace(/\/$/,""):"",l=e.replace(/^\//,"");return t?`${t}/${l}`:`/${l}`}async function _r(i=""){let e=await fetch(gr(i,"native.wasm")),t="",l=new WebAssembly.Memory({initial:1,maximum:256}),r={env:{memory:l},odin_env:{write:(a,u,f)=>{let c=new Uint8Array(r.env.memory.buffer,u,f),x=new TextDecoder().decode(c).split(`
`);for(let v=0;v<x.length-1;v++)console.log(t+x[v]),t="";t+=x[x.length-1]},time_now:()=>BigInt(Date.now())*BigInt(1e6)},odin_dom:{init_event_raw:a=>{console.log("ODIN: init_event_raw",a)}}},o=await WebAssembly.instantiateStreaming(e,r),n=o.instance.exports;return n.init_allocator(n.__heap_base),new wr(o,n,l)}class wr{constructor(e,t,l){this.module=e,this.exports=t,this.memory=l,this.viewBuf=l.buffer,this.int32View=new Int32Array(l.buffer),this.ptrView=new Uint32Array(l.buffer)}createModel(e){return this.exports.wasm_create_model(e.B??1,e.block_size,e.n_embd,e.n_layer,e.n_head,e.vocab_size)}runModel(e){this.exports.wasm_run_model(e)}getModelTensor(e,t,l=0){let r=this.exports.wasm_get_model_tensor(e,t,l);this.checkViews();let o=this.int32View[r/4],n=this.int32View[r/4+1],s=this.ptrView[r/4+2],a=this.ptrView[r/4+3],u=this.ptrView[r/4+4],f=new Int32Array(this.memory.buffer,a,n),c=new Int32Array(this.memory.buffer,u,n),m=new Float32Array(this.memory.buffer,s,o);return new ge([...f],m,[...c])}checkViews(){this.viewBuf!==this.memory.buffer&&(this.viewBuf=this.memory.buffer,this.int32View=new Int32Array(this.memory.buffer),this.ptrView=new Uint32Array(this.memory.buffer))}}var E=(i=>(i[i.Wte=0]="Wte",i[i.Wpe=1]="Wpe",i[i.LmHeadW=2]="LmHeadW",i[i.AttnQkvW=3]="AttnQkvW",i[i.AttnQkvB=4]="AttnQkvB",i[i.AttnProjW=5]="AttnProjW",i[i.AttnProjB=6]="AttnProjB",i[i.MlpW=7]="MlpW",i[i.MlpB=8]="MlpB",i[i.MlpProjW=9]="MlpProjW",i[i.MlpProjB=10]="MlpProjB",i[i.Ln1Gamma=11]="Ln1Gamma",i[i.Ln1Beta=12]="Ln1Beta",i[i.Ln2Gamma=13]="Ln2Gamma",i[i.Ln2Beta=14]="Ln2Beta",i[i.LnFGamma=15]="LnFGamma",i[i.LnFBeta=16]="LnFBeta",i[i.InputTokens=17]="InputTokens",i[i.InputTokenEmbed=18]="InputTokenEmbed",i[i.InputEmbed=19]="InputEmbed",i[i.Ln1Agg=20]="Ln1Agg",i[i.Ln1Norm=21]="Ln1Norm",i[i.AttnQkv=22]="AttnQkv",i[i.Attn=23]="Attn",i[i.AttnSmAgg=24]="AttnSmAgg",i[i.AttnSm=25]="AttnSm",i[i.AttnVOut=26]="AttnVOut",i[i.AttnProj=27]="AttnProj",i[i.AttnResidual=28]="AttnResidual",i[i.Ln2Agg=29]="Ln2Agg",i[i.Ln2Norm=30]="Ln2Norm",i[i.MlpMlp=31]="MlpMlp",i[i.MlpAct=32]="MlpAct",i[i.MlpProj=33]="MlpProj",i[i.MlpResidual=34]="MlpResidual",i[i.LnFAgg=35]="LnFAgg",i[i.LnFNorm=36]="LnFNorm",i[i.Logits=37]="Logits",i[i.LogitsSmAgg=38]="LogitsSmAgg",i[i.LogitsSm=39]="LogitsSm",i))(E||{});function $(i,e,t,l){return N(i,t,e,l)}function br(i,e){let t=1,l=e.n_embd,r=e.n_head,o=e.block_size,n=e.n_layer,s=e.vocab_size,a=l/r,u={B:t,C:l,nHeads:r,T:o,A:a,nBlocks:n,vocabSize:s},f={gl:i,shape:u},c=$(i,t*o,1,1),m=Ar(f);return{gl:i,add:mt(f),inputBuf:new Float32Array,inputLen:6,ln_f:Qt(f),inputTokens:c,lm_head:dt(f,o,l,s),blocks:ji(n).map(()=>zr(f)),output:m.output,posEmbed:Ri(f,c,o),vocabEmbed:Ri(f,c,s),shape:u,softmaxFinal:m,resultBuf:null,sortedBuf:null}}function mt(i){let{gl:e,shape:{B:t,T:l,C:r}}=i;return{output:$(e,t*l,r,1)}}function Ri(i,e,t){let{gl:l,shape:{B:r,T:o,C:n}}=i;return{weight:$(l,t,n,1),output:$(l,r*o,n,1)}}function dt(i,e,t,l){let{gl:r,shape:{B:o,T:n}}=i;return{weight:$(r,l,t,1),bias:$(r,l,1,1),output:$(r,o*n,l,1)}}function Qt(i){let{gl:e,shape:{B:t,T:l,C:r}}=i;return{normWeight:$(e,r,1,1),normBias:$(e,r,1,1),normAgg:$(e,t*l,1,2),output:$(e,t*l,r,1)}}function Ar(i){let{gl:e,shape:{B:t,T:l,vocabSize:r}}=i;return{agg:$(e,t*l,1,2),output:$(e,t*l,r,1)}}function zr(i){let e=Er(i);return{ln_1:Qt(i),attn:Br(i),ln_2:Qt(i),mlp:e,output:e.output}}function Br(i){let{gl:e,shape:{B:t,T:l,C:r,nHeads:o,A:n}}=i,s=mt(i);return{qkvWeight:$(e,3*o*n,r,1),qkvBias:$(e,3*o*n,1,1),attnMatrix:$(e,t*o*l,l,1),attnMatrixAgg:$(e,t*o*l,1,2),attnMatrixSoftmax:$(e,t*o*l,l,1),qkvOutput:$(e,t*l,3*o*n,1),add:mt(i),proj:dt(i,l,r,r),scaledVectors:$(e,t*l,o*n,1),output:s.output}}function Er(i){let{gl:e,shape:{B:t,T:l,C:r}}=i,o=mt(i);return{fcLayer:dt(i,l,r,r*4),mlpGelu:$(e,t*l,r*4,1),projLayer:dt(i,l,r*4,r),addLayer:o,output:o.output}}function Rr(i,e,t){let l=t.createModel(e);o("transformer.wte.weight",E.Wte),o("transformer.wpe.weight",E.Wpe),o("lm_head.weight",E.LmHeadW),r("transformer.ln_f",E.LnFGamma,E.LnFBeta);for(let s=0;s<e.n_layer;s++){let a=`transformer.h.${s}`;r(a+".ln_1",E.Ln1Gamma,E.Ln1Beta,s),r(a+".ln_2",E.Ln2Gamma,E.Ln2Beta,s),r(a+".attn.c_attn",E.AttnQkvW,E.AttnQkvB,s),r(a+".attn.c_proj",E.AttnProjW,E.AttnProjB,s),r(a+".mlp.c_fc",E.MlpW,E.MlpB,s),r(a+".mlp.c_proj",E.MlpProjW,E.MlpProjB,s)}function r(s,a,u,f=0){o(s+".weight",a,f),o(s+".bias",u,f)}function o(s,a,u=0){i[s]?t.getModelTensor(l,a,u).copyFrom(i[s]):console.log("ERROR: missing tensor name:",s)}t.getModelTensor(l,E.InputTokens).buffer.set([2,1,0,1,1,2,0,0,0,0,0]);{let s=performance.now();t.runModel(l),console.log("runModel",(performance.now()-s).toFixed(2)+"ms")}return{native:t,modelPtr:l,lastMemoryBuffer:null,weightsDirty:!0,intersDirty:!0}}function Mr(i,e){let{native:t,modelPtr:l}=i,{shape:{B:r,T:o,vocabSize:n}}=e,s=e.inputLen-1;if(!e.sortedBuf||s>=o-1)return;let a=t.getModelTensor(l,E.InputTokens);for(let u=0;u<r;u++){let f=e.sortedBuf[u*o*n*2+s*n*2+0];a.buffer[u*o+s+1]=f}e.inputLen+=1,t.runModel(l),i.intersDirty=!0,Mi(i,e)}function Mi(i,e){let t=i.weightsDirty||i.intersDirty;i.lastMemoryBuffer!==i.native.memory.buffer&&(i.lastMemoryBuffer=i.native.memory.buffer,t=!0),t&&(Fr(i,e,i.intersDirty,i.weightsDirty),i.weightsDirty=!1,i.intersDirty=!1)}function Fr(i,e,t=!1,l=!1){a(E.Wte,0,e.vocabEmbed.weight,!0),a(E.Wpe,0,e.posEmbed.weight,!0),a(E.InputTokens,0,e.inputTokens),a(E.InputEmbed,0,e.add.output);for(let f=0;f<e.blocks.length;f++){let c=e.blocks[f];a(E.Ln1Gamma,f,c.ln_1.normWeight,!0),a(E.Ln1Beta,f,c.ln_1.normBias,!0),a(E.Ln1Agg,f,c.ln_1.normAgg),a(E.Ln1Norm,f,c.ln_1.output),a(E.AttnQkvW,f,c.attn.qkvWeight,!0),a(E.AttnQkvB,f,c.attn.qkvBias,!0),a(E.AttnQkv,f,c.attn.qkvOutput),a(E.Attn,f,c.attn.attnMatrix),a(E.AttnSmAgg,f,c.attn.attnMatrixAgg),a(E.AttnSm,f,c.attn.attnMatrixSoftmax),a(E.AttnVOut,f,c.attn.scaledVectors),a(E.AttnProjW,f,c.attn.proj.weight,!0),a(E.AttnProjB,f,c.attn.proj.bias,!0),a(E.AttnProj,f,c.attn.proj.output),a(E.AttnResidual,f,c.attn.output),a(E.Ln2Gamma,f,c.ln_2.normWeight,!0),a(E.Ln2Beta,f,c.ln_2.normBias,!0),a(E.Ln2Agg,f,c.ln_2.normAgg),a(E.Ln2Norm,f,c.ln_2.output),a(E.MlpW,f,c.mlp.fcLayer.weight,!0),a(E.MlpB,f,c.mlp.fcLayer.bias,!0),a(E.MlpProjW,f,c.mlp.projLayer.weight,!0),a(E.MlpProjB,f,c.mlp.projLayer.bias,!0),a(E.MlpMlp,f,c.mlp.fcLayer.output),a(E.MlpAct,f,c.mlp.mlpGelu),a(E.MlpProj,f,c.mlp.projLayer.output),a(E.MlpResidual,f,c.mlp.addLayer.output)}a(E.LnFGamma,0,e.ln_f.normWeight,!0),a(E.LnFBeta,0,e.ln_f.normBias,!0),a(E.LnFAgg,0,e.ln_f.normAgg),a(E.LnFNorm,0,e.ln_f.output),a(E.LmHeadW,0,e.lm_head.weight,!0),a(E.Logits,0,e.lm_head.output),a(E.LogitsSmAgg,0,e.softmaxFinal.agg),a(E.LogitsSm,0,e.softmaxFinal.output);let{T:r,vocabSize:o}=e.shape,n=e.softmaxFinal.output.localBuffer,s=new Float32Array(n.length*2);for(let f=0;f<r;f++){let c=[...n.slice(f*o,(f+1)*o)].map((m,x)=>({v:m,i:x}));c.sort((m,x)=>x.v-m.v);for(let m=0;m<c.length;m++)s[(f*o+m)*2+0]=c[m].i,s[(f*o+m)*2+1]=c[m].v}e.sortedBuf=s;function a(f,c,m,x){let v=i.native.getModelTensor(i.modelPtr,f,c);u(`${E[f]}${c}`,v,m),(x?l:t)&&ce(e.gl,m,m.localBuffer)}function u(f,c,m){let x=m.height*m.width*m.channels;if(c.buffer.length!==x)throw new Error(`readToBufferTex: buffer size mismatch for ${f}. bufferTex: ${x} [h: ${m.height}, w: ${m.width}, c: ${m.channels}], wasmBuffer:  ${c.buffer.length} [${c.shape.join(", ")}]`);m.localBuffer=c.buffer}}class Pr{constructor(){this.subs=new Set,this.subscribe=e=>(this.subs.add(e),()=>this.subs.delete(e)),this.notify=()=>{for(let e of this.subs)e()}}}function Tr(i,e){let t=ar(i,e),l=mr(),r=fr.state,o={angle:(r==null?void 0:r.camera.angle)??new y(296,16,13.5),center:(r==null?void 0:r.camera.center)??new y(-8.4,-90,-481.5),transition:{},modelMtx:new D,viewMtx:new D,lookAtMtx:new D,camPos:new y,camPosModel:new y},n={B:1,T:11,C:48,nHeads:3,A:48/3,nBlocks:3,vocabSize:3},s={B:1,T:1024,C:768,nHeads:12,A:768/12,nBlocks:12,vocabSize:50257},a={B:1,T:1024,C:1600,nHeads:25,A:1600/25,nBlocks:48,vocabSize:50257},u={B:1,T:1024,C:12288,nHeads:96,A:12288/96,nBlocks:96,vocabSize:50257};function f(m,x){return{center:m,angle:x}}let c=new y(1e4,0,0);return{native:null,wasmGptModel:null,render:t,inWalkthrough:!1,walkthrough:l,camera:o,shape:n,layout:Ht(n),currExampleId:-1,mainExample:{name:"nano-gpt",enabled:!0,shape:n,offset:new y,modelCardOffset:new y,blockRender:null,camera:f(new y(42.771,0,-569.287),new y(284.959,26.501,12.867))},examples:[{name:"GPT-2 (small)",enabled:!1,shape:s,offset:c.mul(-5),modelCardOffset:c.mul(-2),blockRender:ft((t==null?void 0:t.ctx)??null),camera:f(new y(-65141.321,0,-69843.439),new y(224.459,24.501,1574.24))},{name:"GPT-2 (XL)",enabled:!1,shape:a,offset:c.mul(20),modelCardOffset:c.mul(.5),blockRender:ft((t==null?void 0:t.ctx)??null),camera:f(new y(237902.688,0,-47282.484),new y(311.959,23.501,1382.449))},{name:"GPT-3",enabled:!1,shape:u,offset:c.mul(50),modelCardOffset:c.mul(15),blockRender:ft((t==null?void 0:t.ctx)??null),camera:f(new y(837678.163,0,-485242.286),new y(238.959,10.501,12583.939))}],gptGpuModel:null,jsGptModel:null,stepModel:!1,markDirty:()=>{},htmlSubs:new Pr,mouse:{mousePos:new y},movement:{action:null,actionHover:null,target:[0,0],depth:1,cameraLerp:null},display:{tokenColors:null,tokenIdxColors:null,tokenOutputColors:null,lines:[],hoverTarget:null,dimHover:null,blkIdxHover:null},pageLayout:{height:0,width:0,isDesktop:!0,isPhone:!0}}}function Cr(i,e){let t=performance.now();if(!e.render)return;cr(e.render),e.render.sharedRender.activePhase=ee.Opaque,e.display.lines=[],e.display.hoverTarget=null,e.display.tokenColors=null,e.display.tokenIdxColors=null,e.wasmGptModel&&e.jsGptModel&&Mi(e.wasmGptModel,e.jsGptModel),e.stepModel&&e.wasmGptModel&&e.jsGptModel&&(e.stepModel=!1,Mr(e.wasmGptModel,e.jsGptModel)),e.layout=Ht(e.shape,e.jsGptModel);for(let o of e.examples)if(o.enabled&&!o.layout){let n=Ht(o.shape,null,o.offset);o.layout=n}const l=new y(0,140,0);wl(e,e.layout,l);let r=nr(e.render.queryManager,"render");Ke(r)&&(e.render.lastGpuMs=r),e.render.renderTiming=!1,e.inWalkthrough,Al(e,i),Dl(e.render,e.layout);for(let o of e.examples);hr(e),e.render.sharedRender.activePhase=ee.Opaque,ur(e),sr(e.render.queryManager,"render"),e.render.gl.flush(),e.render.lastJsMs=performance.now()-t}function Zt(){let i=window.LLM_VIZ_ASSET_BASE;return i||(i="/llm-viz"),i.replace(/\/$/,"")}function Fi(i){let e=Zt(),t=i.replace(/^\//,"");return e?`${e}/${t}`:`/${t}`}async function Pi(i){const t=await(await fetch(i)).json();for(const l in t)t[l].shape&&(t[l]=ge.fromJson(t[l]));return t}class Ti{constructor(e){this.progState=null,this.renderState=null,this.modelState=null,this.animationId=null,this.stopped=!1,this.canvasSizeDirty=!0,this.isDirty=!1,this.isWaitingForSync=!1,this.prevTime=0,this.markDirty=()=>{this.stopped||!this.progState||(this.isDirty=!0,this.animationId||(this.prevTime=performance.now(),this.animationId=requestAnimationFrame(this.loop)))},this.loop=t=>{var s,a;if(!(this.isDirty||this.isWaitingForSync)||this.stopped){this.animationId=null;return}const l=this.isDirty;this.isDirty=!1,this.isWaitingForSync=!1;let r=t-this.prevTime;this.prevTime=t,r<8&&(r=16),this.checkSyncObjects();const o=((s=this.renderState)==null?void 0:s.syncObjects.length)??0;(l||this.isDirty)&&this.render(t,r),(((a=this.renderState)==null?void 0:a.syncObjects.length)??0)!==o&&(this.isWaitingForSync=!0),this.animationId=requestAnimationFrame(this.loop)},this.canvas=e,this.random=new _l(4)}async init(){try{const[e,t,l,r]=await Promise.all([Pi(Fi("gpt-nano-sort-t0-partials.json")),Pi(Fi("gpt-nano-sort-model.json")),_r(Zt()),ul(Zt())]),o={data:e,model:t,native:l};this.progState=Tr(this.canvas,r),this.progState.markDirty=this.markDirty,this.progState.walkthrough.markDirty=this.markDirty,this.renderState=this.progState.render,o&&this.renderState&&(this.progState.gptGpuModel=Qi(this.renderState,o,1),this.progState.native=o.native,this.progState.wasmGptModel=Rr(o.model,o.model.config,o.native),this.progState.jsGptModel=br(this.renderState.gl,o.model.config)),this.handleResize(),console.log("LLM Visualization initialized successfully")}catch(e){throw console.error("Error initializing LLM visualization:",e),e}}start(){if(!this.progState||!this.renderState){console.error("Cannot start: visualization not initialized");return}this.stopped=!1,this.prevTime=performance.now(),this.markDirty()}stop(){this.stopped=!0,this.animationId&&(cancelAnimationFrame(this.animationId),this.animationId=null)}checkSyncObjects(){if(!this.renderState)return;const e=this.renderState.gl,t=this.renderState.syncObjects;let l=!1;for(let r=0;r<t.length;r++){const o=t[r];if(o.isReady){l=!0;continue}e.clientWaitSync(o.sync,0,0)===e.TIMEOUT_EXPIRED?this.isWaitingForSync=!0:(o.isReady=!0,o.elapsedMs=performance.now()-o.startTime,e.deleteSync(o.sync),l=!0)}l&&(this.renderState.syncObjects=t.filter(r=>!r.isReady),this.markDirty())}render(e,t){if(!this.renderState||!this.progState)return;if(this.canvasSizeDirty){const r=this.canvas.getBoundingClientRect(),o=window.devicePixelRatio;this.canvas.width=r.width*o,this.canvas.height=r.height*o,this.progState.render.size=new y(r.width,r.height),this.canvasSizeDirty=!1}const l={time:e,dt:t,markDirty:this.markDirty};Cr(l,this.progState),this.progState.htmlSubs.notify()}handleResize(){this.canvasSizeDirty=!0,this.markDirty()}}window.LLMViz=Ti,document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Ci):Ci();function Ci(){const i=document.getElementById("llm-viz");if(i){const e=new Ti(i);e.init().then(()=>e.start()).catch(t=>{console.error("Failed to initialize LLM visualization:",t)}),window.addEventListener("resize",()=>e.handleResize())}}})();
