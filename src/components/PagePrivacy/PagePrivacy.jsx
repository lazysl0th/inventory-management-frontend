import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function PagePrivacy () {
    const { t } = useTranslation("common");

    return (
        <Container>
            <h1>{t("privacy.header")}</h1>
            <p>{t("privacy.paragraphPrefix")}<a href="mailto:u69740384@gmail.com">support@inventory-management.com</a>.</p>
            <p>{t("privacy.paragraphSuffix")}</p>
            <Link to="/">{t("links.back")}</Link>
        </Container>
    )
}