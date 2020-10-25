import React, { useContext, useState, useEffect, useRef } from "react"
import { GlobalContext } from "../layout"
import { Box } from "@material-ui/core"
import styled from "styled-components"
import ReCAPTCHA from "react-google-recaptcha"
import MyInput from "../myInput"
import MySelect from "../mySelect"
import ButtonForm from "../buttonForm"
import Check from "../../images/svg/check.svg"
import MyTextarea from "../myTextarea"
let axios = require("axios")

const text = {
  fr: {
    title: "Contact",
    mention: "Informations requises",
    form: {
      select: [
        {
          value: null,
          label: "Veuillez sélectionner un sujet",
          disabled: true,
        },
        {
          value: "Informations actionnaires",
          label: "Informations actionnaires",
        },
        {
          value: "Informations investisseurs",
          label: "Informations investisseurs",
        },
        { value: "Assemblée générale", label: "Assemblée générale" },
        { value: "Demande de documents", label: "Demande de documents" },
        {
          value: "Responsabilité environnementale et sociale",
          label: "Responsabilité environnementale et sociale",
        },
        { value: "Gouvernance", label: "Gouvernance" },
        { value: "Données personnelles", label: "Données personnelles" },
        {
          value: "Fonctionnement du site internet",
          label: "Fonctionnement du site internet",
        },
        { value: "Autres requêtes", label: "Autres requêtes" },
      ],
      textarea: "Message",
      firstName: "Prénom",
      lastName: "Nom",
      email: "E-mail",
      errorMessage: "Information requise",
    },
    submit: "Envoyer",
    legalNotice:
      "En envoyant ce message, vous acceptez les Conditions Générales d’Utilisation et consentez au traitement de vos données, conformément à la Politique de Confidentialité d’Hermès.",
    confirmationMessage: {
      title: "Voilà",
      message:
        "Merci, votre e-mail a été envoyé. Nous ne tarderons pas à vous répondre.",
      button: "Envoyer un nouveau message",
      recap: {
        title: "Récapitulatif de votre envoi",
      },
    },
  },
  en: {
    title: "Contact",
    mention: "Required information",
    form: {
      select: [
        { value: null, label: "Please select a subject", disabled: true },
        {
          value: "Shareholders information",
          label: "Shareholders information",
        },
        {
          value: "Investors information",
          label: "Investors information",
        },
        { value: "Annual General Meeting", label: "Annual General Meeting" },
        { value: "Documents order", label: "Documents order" },
        {
          value: "Environmental and social responsibility",
          label: "Environmental and social responsibility",
        },
        { value: "Governance", label: "Governance" },
        { value: "Personal data", label: "Personal data" },
        {
          value: "Website functioning",
          label: "Website functioning",
        },
        { value: "Other requests", label: "Other requests" },
      ],
      textarea: "Message",
      firstName: "First name",
      lastName: "Last name",
      email: "E-mail",
      errorMessage: "Required information",
    },
    submit: "Submit",
    legalNotice:
      "By sending your message, you agree to accept the General Terms and Conditions of Use and that your data will be processed in compliance with the Privacy Policy of Hermès.",
    confirmationMessage: {
      title: "Voilà",
      message:
        "Thank you, your email has been sent. We will reply to you shortly.",
      button: "Send a new message",
      recap: {
        title: "Summary",
      },
    },
  },
}

export default () => {
  const { lang, wording } = useContext(GlobalContext)
  const data = text[lang]
  const [select, setSelect] = useState("")
  const [message, setMessage] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [myErrorMessage, setMyErrorMessage] = useState(data.form.errorMessage)
  const [captcha, setCaptcha] = useState(false)
  const [isFormValid, setIsFormValid] = useState(false)
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const refCaptcha = useRef()

  const handleCaptcha = token => {
    return token ? setCaptcha(true) : null
  }

  // Check the email validity and modify the error message
  // if it is empty or has an invalid format
  useEffect(() => {
    if (email) {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setIsEmailValid(true)
      } else {
        setMyErrorMessage(wording(lang, "InvalidEmail"))
        setIsEmailValid(false)
      }
    } else {
      setIsEmailValid(false)
      setMyErrorMessage(data.form.errorMessage)
    }
  }, [email])

  // Check if all the fields have been filled properly
  useEffect(() => {
    if (select && message && firstName && lastName && isEmailValid) {
      setIsFormValid(true)
    } else {
      setIsFormValid(false)
    }
  }, [select && message && firstName && lastName && isEmailValid])

  // Call the recaptcha if the form is valid
  const handleForm = e => {
    if (isFormValid) {
      e.preventDefault()
      refCaptcha.current.execute()
    } else {
      e.preventDefault()
    }
  }
  // Submit form if recaptcha is validated
  useEffect(() => {
    if (captcha && isFormValid) {
      let formData = JSON.stringify({
        email: email,
        firstname: firstName,
        lastname: lastName,
        subject: select.value,
        message: message,
      })

      let config = {
        method: "post",
        url: process.env.API_GATEWAY_URL + "/contact",
        headers: {
          "Content-Type": "application/json",
        },
        data: formData,
      }
      axios(config)
        .then(function (response) {
          if (response.status === 200) setIsFormSubmitted(true)
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }, [captcha && isFormValid])

  // Scroll to top of page
  useEffect(() => {
    if (isFormSubmitted) window.scrollTo(0, 0)
  }, [isFormSubmitted])

  if (isFormSubmitted === false) {
    return (
      <Box
        mt={{ xs: "40px 0 60px", md: "50px 0 100px" }}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Form
          component="form"
          onSubmit={handleForm}
          isFormValid={isFormValid}
          bgcolor="var(--floralWhite)"
          width="100%"
          fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
        >
          <Box
            boxSizing="border-box"
            width={{ xs: "100%", sm: "100%", md: "552px" }}
            m="auto"
            p={{
              xs: "40px 30px 40px 30px",
              sm: "40px 40px 40px 40px",
              md: "70px 0px 100px 0px",
            }}
          >
            <Box
              component="p"
              mb={{ xs: "30px", sm: "40px", md: "45px" }}
              color="var(--black)"
            >
              *{data.mention}
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }} id="mySelect-form">
              <MySelect
                value={select}
                setValue={setSelect}
                options={data.form.select}
                errorMessage={data.form.errorMessage}
                showErrorMessage={showErrorMessage && select === ""}
              />
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }}>
              <MyTextarea
                placeholder={data.form.textarea}
                message={message}
                setMessage={setMessage}
                errorMessage={data.form.errorMessage}
                showErrorMessage={showErrorMessage && message === ""}
              />
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }}>
              <MyInput
                placeholder={data.form.firstName}
                errorMessage={data.form.errorMessage}
                value={firstName}
                setValue={setFirstName}
                showErrorMessage={showErrorMessage && firstName === ""}
                firstName
              />
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }}>
              <MyInput
                placeholder={data.form.lastName}
                value={lastName}
                setValue={setLastName}
                errorMessage={data.form.errorMessage}
                showErrorMessage={showErrorMessage && lastName === ""}
                lastName
              />
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }}>
              <MyInput
                placeholder={data.form.email}
                errorMessage={myErrorMessage}
                value={email}
                setValue={setEmail}
                isEmail
                isEmailValid={isEmailValid}
                showErrorMessage={showErrorMessage && email === ""}
                email
              />
            </Box>
            <Box mb={{ xs: "30px", sm: "40px", md: "45px" }}>
              <ReCAPTCHA
                sitekey="6LeKKewUAAAAAIuzT1BlUdHTJ2zSzBv3yPkGLkOX"
                ref={refCaptcha}
                size="invisible"
                onChange={handleCaptcha}
              />
            </Box>
            <Box mb={{ xs: "40px", sm: "60px" }}>
              <ButtonForm
                action={() => (isFormValid ? null : setShowErrorMessage(true))}
                isFormValid={isFormValid}
                text={data.submit}
                width={{ xs: "275px", sm: "356px" }}
              />
            </Box>
            <Box
              component="p"
              fontFamily="Helvetica, 'Helvetica W01', Arial, sans-serif"
              fontSize="14px"
              lineHeight="24px"
              maxWidth="552px"
            >
              {data.legalNotice}
            </Box>
          </Box>
        </Form>
      </Box>
    )
  } else if (isFormSubmitted === true) {
    return (
      <Submitted
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // ref={refToTop}
      >
        <Box
          mt={{ xs: "40px", sm: "40px", md: "50px" }}
          display="flex"
          alignItems="center"
          justifyContent="center"
          mb={{ xs: "20px", md: "30px" }}
          width={{ xs: "70px", md: "100px" }}
          height={{ xs: "70px", md: "100px" }}
          borderRadius="50%"
          border="1px solid var(--beige)"
          bgcolor="var(--white)"
          css={`
            svg {
              width: 17.5px;
              height: 11.7px;
            }
            @media (min-width: 960px) {
              svg {
                width: 25px;
                height: 17px;
              }
            }
          `}
        >
          <Check />
        </Box>
        <Box
          component="h2"
          textAlign="center"
          mb={{ xs: "20px", md: "30px" }}
          fontSize={{ md: "40px" }}
          lineHeight={{ md: "46px" }}
        >
          {data.confirmationMessage.title}
        </Box>
        <Box
          component="p"
          mb={{ xs: "40px", md: "80px" }}
          textAlign="center"
          width={{ sm: "480px", md: "748px" }}
          fontSize="18px"
        >
          {data.confirmationMessage.message}
        </Box>
        <ButtonForm
          text={data.confirmationMessage.button}
          width={{ xs: "275px", sm: "356px" }}
          isFormValid
          action={() => {
            setIsFormSubmitted(false)
            setIsFormValid(false)
            setSelect("")
            setMessage("")
            setFirstName("")
            setLastName("")
            setEmail("")
            setCaptcha(false)
          }}
        />
      </Submitted>
    )
  }
}
const Form = styled(Box)`
  .MuiFormControl-root {
    width: 100%;
  }

  /* SELECT FORM BLOCK B15  */
  #mySelect-form {
    .MuiSelect-select {
      &:focus {
        background-color: white;
      }
    }
    /* border:focus */
    .MuiOutlinedInput-root {
      &.Mui-focused fieldset {
        border: 1px solid var(--black);
      }
    }
  }
`
const Submitted = styled(Box)`
  margin-top: 40px;
  margin-bottom: 60px;
  @media (min-width: 960px) {
    margin-top: 50px;
    margin-bottom: 100px;
  }
`
