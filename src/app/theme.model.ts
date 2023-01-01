
export class StoreTheme {
  name: string = ''
  back_code: string = ''
  text_code: string = ''
  nav_code: string = ''
  style: string = ''
  bg_color: Array<number> = []
  btn_color: Array<number> = []
  img?: URL

  constructor(
    name: string,
    back_code: string,
    text_code: string,
    nav_code: string,
    style: string,
    bg_color: Array<number>,
    btn_color: Array<number>,
    img?: string
    ) {

    this.name = name ?? ""
    this.back_code = back_code ?? "";
    this.text_code = text_code ?? "";
    this.nav_code = nav_code ?? "light";
    this.style = style
    this.bg_color = bg_color ?? [];
    this.btn_color = btn_color ?? [];

    if (img){
      this.img = new URL(img)
    }
  }
}