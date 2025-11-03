import { Card, Table, Badge, Alert } from "react-bootstrap";

export default function StatsTab({ inventory }) {
    const { itemsCount, stats } = inventory;

    if (!stats) return (<Alert variant="secondary" className="m-3"> Statistics not available for this inventory. </Alert>);

    return (
        <div className="p-3 d-flex flex-column gap-4">
            <h5 className="mb-2">Inventory Statistics</h5>

            <Card>
                <Card.Body>
                    <strong>Total items:</strong>{" "}
                    <Badge bg="primary">{itemsCount}</Badge>
                </Card.Body>
            </Card>

            {stats.numericStats?.length > 0 && (
                <Card>
                    <Card.Header>Numeric fields</Card.Header>
                    <Card.Body>
                        <Table bordered hover responsive size="sm" className="align-middle">
                        <thead>
                            <tr>
                                <th>Field</th>
                                <th>Average</th>
                                <th>Min</th>
                                <th>Max</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.numericStats.map((field) => (
                                <tr key={field.field}>
                                    <td>{field.field}</td>
                                    <td>{field.average?.toFixed(2) ?? "—"}</td>
                                    <td>{field.min ?? "—"}</td>
                                    <td>{field.max ?? "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}

            {stats.textStats?.length > 0 && (
                <Card>
                    <Card.Header>Most common values</Card.Header>
                    <Card.Body>
                        {stats.textStats.map((field) => (
                        <div key={field.field} className="mb-3">
                            <strong>{field.field}</strong>
                            <Table bordered size="sm" className="mt-2">
                                <thead>
                                    <tr>
                                        <th>Value</th>
                                        <th>Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {field.topValues.map((value, index) => (
                                        <tr key={index}>
                                            <td>{value.value || <em>—</em>}</td>
                                            <td>{value.count}</td>
                                        </tr>))}
                                </tbody>
                            </Table>
                        </div>))}
                    </Card.Body>
                </Card>)}
            {(!stats.numericStats?.length && !stats.textStats?.length) &&
            (<Alert variant="light" className="border">No aggregated data available yet.</Alert>)}
        </div>
    );
}
