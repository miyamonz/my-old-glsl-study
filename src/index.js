import frag from "./shader.frag"
import vert from "./shader.vert"

window.onload = function(){
  // ESCキーで描画を止めるためのイベントハンドラ
  window.addEventListener('keydown', k, true);
  function k(h){e = (h.keyCode !== 27);}

  const ccc = document.querySelector('#c');
  const ctx = c.getContext('webgl');
  const ppp = ctx.createProgram();

  // シェーダ生成関数
  const hhh = function(i, j){
    k = ctx.createShader(ctx.VERTEX_SHADER - i);
    ctx.shaderSource(k, j);
    ctx.compileShader(k);
    ctx.attachShader(ppp, k);
    return ctx.getShaderInfoLog(k);
  }

  if(!hhh(0, vert) && !hhh(1, frag)){ctx.linkProgram(ppp);}

  const eee = ctx.getProgramParameter(ppp, ctx.LINK_STATUS);
  ctx.useProgram(ppp);

  const uuu = {};
  uuu.time = ctx.getUniformLocation(ppp, 'time');
  uuu.resolution = ctx.getUniformLocation(ppp, 'resolution');
  ctx.bindBuffer(ctx.ARRAY_BUFFER, ctx.createBuffer());
  ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), ctx.STATIC_DRAW);
  const aaa = ctx.getAttribLocation(ppp, 'position');
  ctx.enableVertexAttribArray(aaa);
  ctx.vertexAttribPointer(aaa, 3, ctx.FLOAT, false, 0, 0);
  ctx.clearColor(0, 0, 0, 1);

  // 無名関数でメインルーチンを実行
  function update(milli) {
    if(!eee){return;} // シェーダのリンクに失敗していたら実行しない

    // ビューポートを動的に指定する
    c.width  = window.innerWidth;
    c.height = window.innerHeight;
    ctx.viewport(0, 0, c.width, c.height);

    // フレームバッファをクリア
    ctx.clear(ctx.COLOR_BUFFER_BIT);

    // uniform変数をプッシュ
    ctx.uniform1f(uuu.time, milli * 0.001);
    ctx.uniform2fv(uuu.resolution, [c.width, c.height]);

    // プリミティブのレンダリング
    ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    ctx.flush();

    // 再起
    requestAnimationFrame(update);
  };
  update();
};
