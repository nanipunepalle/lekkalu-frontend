import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "./StatsAccordion.module.css";

export default function StatsAccordion({
                                           label,
                                           expanded,
                                           handleChange,
                                           children,
                                       }) {
    return (
        <Accordion className="accordion" expanded="expanded"
            // onChange=handleChange(label)
        >
            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                <Typography className={styles.heading}>{label}</Typography>
            </AccordionSummary>
            <AccordionDetails>{children}</AccordionDetails>
        </Accordion>
    );
}
