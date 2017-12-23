import frag from "./1213.frag"
import Veda from "vedajs"

const veda = new Veda();

veda.setCanvas(canvas)
veda.loadFragmentShader(frag)
veda.play();
