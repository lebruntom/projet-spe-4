import React, { useContext } from "react";
import { Field, Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { login } from "../axios/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../store/AuthContext";
import { showToastMessage } from "../utils/common";

//Formulaire de connexion
const LoginForm = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(AuthContext);

  //Regles sur les champs du formaulaire
  const validationSchema = Yup.object().shape({
    email: Yup.string().email(`Email invalide`).required(`Email requis`),
    password: Yup.string()
      .min(8, `Min 8 caractères`)
      .required(`Mot de passe requis`),
  });

  //Valeurs initiales du formulaire
  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    //Soumission du formulaire
    onSubmit: async (values) => {
      try {
        //Call api pour connecté le user si les champs sont bon
        login({ email: values.email, password: values.password })
          .then((res) => {
            //Si la reponse est 200 on rempli le contexte et on redirige
            if (res.status === 200) {
              setCurrentUser({ email: res.data.email, id: res.data.id, role: res.data.role });
              navigate("/");
              showToastMessage("Connexion réussie", "success");
            }
          })
          .catch((err) => {
            //Gestion des messages d'erreurs
            if (err.response.status && err.response.status === 401) {
              showToastMessage("email ou mot de passe incorrect", "warn");
            } else {
              showToastMessage("erreur, veuillez réessayer", "error");
            }
          });
      } catch (error) {
        alert(error);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Field
          type="email"
          id="email"
          as={Input}
          name="email"
          icon="IoMdMail"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="johndoe@domain.com"
          label="Email"
          error={{
            name: formik.errors.email,
            touched: formik.touched.email,
          }}
        />
        <Field
          type="password"
          id="password"
          as={Input}
          name="password"
          icon="IoMdLock"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="••••••••••••"
          label="Mot de passe"
          error={{
            name: formik.errors.password,
            touched: formik.touched.password,
          }}
        />
        <div className="flex justify-end mt-4">
          <Button type="submit">Se connecter</Button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default LoginForm;
