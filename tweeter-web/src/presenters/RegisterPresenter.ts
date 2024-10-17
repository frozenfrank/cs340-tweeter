import { Buffer } from "buffer";
import { UserInfo } from "../components/userInfo/UserInfoProvider";
import { UserService } from "../model/service/UserService";
import { LoadingPresenter, LoadingView } from "./Presenter";

export interface RegisterView extends LoadingView {
  updateUserInfo: UserInfo["updateUserInfo"];
  setImageUrl(imageUrl: string): void;
  setImageFileExtension(ext: string): void;
  navigate(url: string): void;
}

export class RegisterPresenter extends LoadingPresenter<RegisterView> {
  private userService = new UserService();

  private imageBytes: Uint8Array = new Uint8Array();

  public async doRegister(
    firstName: string,
    lastName: string,
    alias: string,
    password: string,
    imageFileExtension: string,
    rememberMe: boolean,
  ) {
    await this.doTryOperation(async () => {
      const [user, authToken] = await this.userService.register(
        firstName,
        lastName,
        alias,
        password,
        this.imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate("/");
    }, "register user");
  };

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  };

  public handleImageFile(file: File | undefined) {
    if (file) {
      this.view.setImageUrl(URL.createObjectURL(file));

      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const imageStringBase64 = event.target?.result as string;

        // Remove unnecessary file metadata from the start of the string.
        const imageStringBase64BufferContents =
          imageStringBase64.split("base64,")[1];

        const bytes: Uint8Array = Buffer.from(
          imageStringBase64BufferContents,
          "base64"
        );

        this.imageBytes = bytes;
      };
      reader.readAsDataURL(file);

      // Set image file extension (and move to a separate method)
      const fileExtension = this.getFileExtension(file);
      if (fileExtension) {
        this.view.setImageFileExtension(fileExtension);
      }
    } else {
      this.view.setImageUrl("");
      this.imageBytes = new Uint8Array();
    }
  };
}
