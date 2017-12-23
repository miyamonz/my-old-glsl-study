import frag from "./1213.frag"
import vert from "./shader.vert"
window.onload = function(){
  const cvs = document.querySelector('#canvas');
  const ctx = cvs.getContext('webgl');
  const pgm = ctx.createProgram();

  // シェーダ生成関数
  const hhh = function(i, j){
    const k = ctx.createShader(ctx.VERTEX_SHADER - i);
    ctx.shaderSource(k, j);
    ctx.compileShader(k);
    ctx.attachShader(pgm, k);
    return ctx.getShaderInfoLog(k);
  }

  if(!hhh(0, vert) && !hhh(1, frag)){ctx.linkProgram(pgm);}

  const isLinked = ctx.getProgramParameter(pgm, ctx.LINK_STATUS);
  ctx.useProgram(pgm);

  const uuu = {};
  uuu.time = ctx.getUniformLocation(pgm, 'time');
  uuu.resolution = ctx.getUniformLocation(pgm, 'resolution');
  uuu.mouse = ctx.getUniformLocation(pgm, 'mouse');
  ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), ctx.STATIC_DRAW);
  const atr = ctx.getAttribLocation(pgm, 'position');
  ctx.enableVertexAttribArray(atr);
  ctx.vertexAttribPointer(atr, 3, ctx.FLOAT, false, 0, 0);
  ctx.clearColor(0, 0, 0, 1);

  let stop;
  window.addEventListener('keydown',  e => { if( e.keyCode === 27 ) stop = !stop }, true);

  function update(milli) {
    if(!isLinked || stop){return;} // シェーダのリンクに失敗していたら実行しない

    // ビューポートを動的に指定する
    cvs.width  = window.innerWidth;
    cvs.height = window.innerHeight;
    ctx.viewport(0, 0, cvs.width, cvs.height);

    // フレームバッファをクリア
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    // uniform変数をプッシュ
    ctx.uniform1f(uuu.time, milli * 0.001);
    ctx.uniform2fv(uuu.resolution, [cvs.width, cvs.height]);

    // プリミティブのレンダリング
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    ctx.flush();

    // 再起
    requestAnimationFrame(update);
  };
  update();
};
