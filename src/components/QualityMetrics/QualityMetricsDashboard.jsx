import { useRef, useEffect } from 'react'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { select } from 'd3';
// import PropTypes from 'prop-types'
import ColumnSelector from './ColumnSelector' // TODO: make one dropdown selector element to re use here and in the entry table
import Histogram from './Histogram'
import ScatterChart from './ScatterChart'

const data = [25,38, 45, 60, 20];

const QualityMetricsDashboard = props => {

    return (
        <Container>
            <Row className="qualityMetrics-row" id='qualityMetrics-row1'>
                <Col className="qualityMetrics-col">
                    <ColumnSelector />
                    <Histogram />
                </Col>
                <Col className="qualityMetrics-col">
                    <ColumnSelector />
                    <Histogram />
                </Col>
            </Row>
            <Row className="qualityMetrics-row" id='qualityMetrics-row2'>
                <ScatterChart />
            </Row>
            
        </Container>
    )
}

// QualityMetricsDashboard.propTypes = {

// }

export default QualityMetricsDashboard
