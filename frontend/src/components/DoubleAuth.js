import React, { useContext, useEffect, useState } from "react";
import { Field, Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Input from "./ui/Input";
import Button from "./ui/Button";
import {
  createDoubleAuth,
  qrCodeStatus,
  verifyDoubleAuth,
} from "../axios/auth";
import { AuthContext } from "../store/AuthContext";
import { showToastMessage } from "../utils/common";
import { useCookies } from "react-cookie";

const DoubleAuth = ({ setAuthorize }) => {
  const [qrCode, setQrCode] = useState("");
  const { currentUser } = useContext(AuthContext);
  const [cookies, setCookie] = useCookies();

  //Regles sur les champs du formaulaire
  const validationSchema = Yup.object().shape({
    code: Yup.string().required(`Code requis`),
  });

  //Valeurs initiales du formulaire
  const initialValues = {
    code: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    //Soumission du formulaire
    onSubmit: async (values) => {
      //Call api pour verifier le code saisi par le user
      verifyDoubleAuth({ token: values.code, email: currentUser.email })
        .then((res) => {
          if (res.status === 200) {
            setAuthorize(res.data.res);
            showToastMessage("Vérification réussie", "success");
            setCookie("doubleAuth", true);
          }
        })
        .catch((err) => {
          if (err.response.status && err.response.status === 403) {
            showToastMessage("Code incorrect", "warn");
          }
        });
    },
  });

  // Generation du qrcode au chargement du composant
  useEffect(() => {
    //On vérifie si le user à deja vu le qr code pour l'afficher ou non
    qrCodeStatus().then((res) => {
      if (res.data.status === 0) {
        //Ccall api qui renvoi un qrcode
        createDoubleAuth({ email: currentUser.email }).then((res) => {
          //On rempli le state avec le qrcode
          res.data.imageUrl && setQrCode(res.data.imageUrl);
        });
      }
    });
  }, [currentUser]);

  return (
    <div
      style={{ minHeight: "calc(100vh - 150px)" }}
      className="flex items-center justify-center "
    >
      <div className="bg-white max-w-[500px] p-6 rounded-lg min-w-[300px] w-1/2 shadow-md">
        <div className="text-center text-lg text-bold text-blue">
          Verifions votre identitée
        </div>
        <div className="text-xs text-center">
          Scannez le qrCode et saisissez le code
        </div>
        {/* Affichage du qrcode  */}
        {qrCode !== "" && (
          <div className="flex justify-center">
            <img src={qrCode} alt="qr code" width={200} />
          </div>
        )}
        {/* Formulaire pour verifier le code saisie par le user  */}
        <FormikProvider value={formik}>
          <Form>
            <Field
              type="text"
              id="code"
              as={Input}
              name="code"
              onChange={formik.handleChange}
              value={formik.values.email}
              placeholder=""
              label="Code"
              error={{
                name: formik.errors.email,
                touched: formik.touched.email,
              }}
            />

            <div className="flex justify-end mt-4">
              <Button type="submit">Verifier</Button>
            </div>
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
};

export default DoubleAuth;
