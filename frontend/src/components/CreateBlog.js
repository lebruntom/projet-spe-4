import React, { useContext } from "react";
import * as Yup from "yup";
import { Field, Form, FormikProvider, useFormik } from "formik";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { createBlog } from "../axios/blog";
import { AuthContext } from "../store/AuthContext";
import { showToastMessage } from "../utils/common";

const CreateBlog = ({ setNeedRefresh }) => {
  const { currentUser } = useContext(AuthContext);

  //Regles sur les champs du formaulaire
  const validationSchema = Yup.object().shape({
    title: Yup.string().required(`Titre requis`),
    subject: Yup.string().required(`Contenu requis`),
  });

  //Valeurs initiales du formulaire
  const initialValues = {
    title: "",
    subject: "",
    status: false,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    //Soumission du formulaire
    onSubmit: async (values) => {
      const email = currentUser.email;
      const subject = values.subject;
      const title = values.title;
      const status = values.status;
      //call api pour creer le blog
      createBlog({ email, subject, title, status })
        .then((res) => {
          setNeedRefresh(true);
          showToastMessage("Article ajouté", "success");
          formik.resetForm();
        })
        .catch((err) => {
          showToastMessage("erreur veuillez réssayer", "error");
        });
      try {
      } catch (error) {
        alert(error);
      }
    },
  });

  return (
    <FormikProvider value={formik}>
      <Form>
        <Field
          type="text"
          id="title"
          as={Input}
          name="title"
          onChange={formik.handleChange}
          value={formik.values.title}
          placeholder="Titre du blog"
          label="Titre"
          error={{
            name: formik.errors.title,
            touched: formik.touched.title,
          }}
        />
        <Field
          type="text"
          id="subject"
          as={Input}
          name="subject"
          onChange={formik.handleChange}
          value={formik.values.subject}
          placeholder="Contenu du blog"
          label="Contenu"
          error={{
            name: formik.errors.subject,
            touched: formik.touched.subject,
          }}
        />
        <div className="flex items-center">
          <Field
            type="checkbox"
            id="status"
            name="status"
            onChange={formik.handleChange}
            checked={formik.values.status}
            label="Public"
            error={{
              name: formik.errors.status,
              touched: formik.touched.status,
            }}
          />
          <div className="ml-2">Blog public</div>
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit">Créer</Button>
        </div>
      </Form>
    </FormikProvider>
  );
};

export default CreateBlog;
