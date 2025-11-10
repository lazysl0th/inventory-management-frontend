import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function PageDeleteUserData () {
    const { t } = useTranslation("common");
    return (
      <Container>
          <h1>{t("deleteUserData.header")}</h1>
          <p>{t("deleteUserData.paragraphPrefix")}<a href="mailto:u69740384@gmail.com">support@inventory-management.com</a>.</p>
          <p>{t("deleteUserData.paragraphSuffix")}</p>
        <Link to="/">{t("links.back")}</Link>
      </Container>
    )
}