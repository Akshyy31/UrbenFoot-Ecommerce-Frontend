import React, { useContext } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthContext from "../contextapi/AuthContext";

const Register = () => {
  const { registerUser } = useContext(AuthContext);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(5, "Username must be at least 5 characters")
      .required("Username is required"),
    first_name: Yup.string()
      .matches(/^[A-Za-z]+$/, "First name should contain only letters")
      .required("First name is required"),
    last_name: Yup.string()
      .matches(/^[A-Za-z]+$/, "Last name should contain only letters")
      .required("Last name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters long")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .required("Password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      password2: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("✅ Submitted values:", values);
      registerUser(values);
    },
  });

  return (
    <Container className="py-4 bg-light" style={{ minHeight: "100vh" }}>
      
        
          <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
            <Row className="g-0 justify-content-center align-items-center">
             
              <Col md={7} className="d-none d-md-block">
                <img
                  src="https://cdn.dribbble.com/userupload/31820057/file/original-f00df735e0ae8b12b596efe4e7d1d5f3.png"
                  alt="Register"
                  className="img-fluid"
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </Col>

             
              <Col md={5} className="p-4 bg-white">
                <Card.Body>
                  <h3 className="mb-4 text-center text-uppercase">Register</h3>
                  <Form onSubmit={formik.handleSubmit}>
                    {[
                      { name: "username", label: "Username" },
                      { name: "first_name", label: "First Name" },
                      { name: "last_name", label: "Last Name" },
                      { name: "email", label: "Email", type: "email" },
                      { name: "phone", label: "Phone" },
                      { name: "password", label: "Password", type: "password" },
                      {
                        name: "password2",
                        label: "Confirm Password",
                        type: "password",
                      },
                    ].map((field) => (
                      <Form.Group
                        controlId={field.name}
                        className="mb-3"
                        key={field.name}
                      >
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                          type={field.type || "text"}
                          name={field.name}
                          value={formik.values[field.name]}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched[field.name] &&
                            !!formik.errors[field.name]
                          }
                          placeholder={`Enter your ${field.label.toLowerCase()}`}
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors[field.name]}
                        </Form.Control.Feedback>
                      </Form.Group>
                    ))}

                    <div className="d-flex justify-content-center">
                      <Button
                        type="submit"
                        variant="dark"
                        size="lg"
                        className="mt-3 w-100"
                        disabled={formik.isSubmitting}
                      >
                        Register
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Col>
            </Row>
          </Card>
     
    </Container>
  );
};

export default Register;
