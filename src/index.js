import frag from "./shader.frag"
import vert from "./shader.vert"

window.onload = function(){
  // 変数宣言
  var a, c, d, e, f, g, h, p, t, u, v, x, y, z;

  // ESCキーで描画を止めるためのイベントハンドラ
  window.addEventListener('keydown', k, true);
  function k(h){e = (h.keyCode !== 27);}

  c = document.querySelector('#c');
  g = c.getContext('webgl');

  p = g.createProgram();

  // シェーダ生成関数
  h = function(i, j){
    k = g.createShader(g.VERTEX_SHADER - i);
    g.shaderSource(k, j);
    g.compileShader(k);
    g.attachShader(p, k);
    return g.getShaderInfoLog(k);
  }

  if(!h(0, vert) && !h(1, frag)){g.linkProgram(p);}

  e = g.getProgramParameter(p, g.LINK_STATUS);
  g.useProgram(p);

  u = {};
  u.time = g.getUniformLocation(p, 'time');
  u.resolution = g.getUniformLocation(p, 'resolution');
  g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer());
  g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1,1,0,-1,-1,0,1,1,0,1,-1,0]), g.STATIC_DRAW);
  a = g.getAttribLocation(p, 'position');
  g.enableVertexAttribArray(a);
  g.vertexAttribPointer(a, 3, g.FLOAT, false, 0, 0);
  g.clearColor(0, 0, 0, 1);
  z = new Date().getTime();

  // 無名関数でメインルーチンを実行
  function update() {
    // シェーダのリンクに失敗していたら実行しない
    if(!e){return;}

    // ビューポートを動的に指定する
    c.width = x = window.innerWidth;
    c.height = y = window.innerHeight;
    g.viewport(0, 0, x, y);

    // 時間の経過を調べる
    d = (new Date().getTime() - z) * 0.001;

    // フレームバッファをクリア
    g.clear(g.COLOR_BUFFER_BIT);

    // uniform変数をプッシュ
    g.uniform1f(u.time, d);
    g.uniform2fv(u.resolution, [x, y]);

    // プリミティブのレンダリング
    g.drawArrays(g.TRIANGLE_STRIP, 0, 4);
    g.flush();

    // 再起
    requestAnimationFrame(update);
  };

  update();

};




