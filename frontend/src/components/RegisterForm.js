import React from "react";
import { Field, Form, FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { register } from "../axios/auth";
import { showToastMessage } from "../utils/common";

const RegisterForm = () => {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Email invalide").required("Email requis"),
    password: Yup.string()
      .min(8, "Min 8 caractères")
      .required("Mot de passe requis"),
  });

  const initialValues = {
    email: "",
    password: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        register({ email: values.email, password: values.password })
          .then((res) => {
            if (res.status === 201) {
              showToastMessage("Utilisateur créé avec succès", "success");
              formik.resetForm();
            }
          })
          .catch(() => {
            showToastMessage("Erreur, veuillez réessayer", "error");
          });
      } catch (error) {
        alert(error);
      }
    },
  });

  return (
    <div className="mx-auto bg-white border rounded-lg p-6 shadow mt-8">
      <FormikProvider value={formik}>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Créer un utilisateur
        </h2>
        <Form className="space-y-4">
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
            placeholder="••••••••"
            label="Mot de passe"
            error={{
              name: formik.errors.password,
              touched: formik.touched.password,
            }}
          />
          <div className="flex justify-end">
            <Button type="submit" className="bg-black text-white px-4 py-2 rounded transition">
              Créer l'utilisateur
            </Button>
          </div>
        </Form>
      </FormikProvider>
    </div>
  );
};

export default RegisterForm;
