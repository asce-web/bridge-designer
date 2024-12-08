export class WidgetHelper {
  public static initToolbarImgButton(title: string, imgSrc: string, tool: any) {
    let img = document.createElement('img');
    img.src = imgSrc;
    img.title = title;
    tool[0].appendChild(img);
    tool.jqxButton({ height: 28 });
  }
}
