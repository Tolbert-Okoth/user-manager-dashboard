// src/pages/DashboardPage.js

import React, { useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  Alert,
  Button, // <-- 1. RE-ADD THIS
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStats } from '../store/analyticsSlice';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Colors for the charts
const COLORS_STATUS = ['#00C49F', '#FF8042']; // Green (Active), Orange (Inactive)
const COLORS_ROLES = ['#0088FE', '#FFBB28']; // Blue (Admin), Yellow (User)

const DashboardPage = () => {
  const dispatch = useDispatch();

  const { stats, isLoading, error } = useSelector(
    (state) => state.analytics
  );
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchStats());
  }, [dispatch]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status" />
        </div>
      );
    }

    if (error) {
      return <Alert variant="danger">{error}</Alert>;
    }

    if (!stats) {
      return <Alert variant="info">No analytics data available.</Alert>;
    }

    return (
      <Row>
        {/* --- Stat Card: Total Users --- */}
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body className="text-center">
              <Card.Title>Total Users</Card.Title>
              <Card.Text as="h1">{stats.totalUsers}</Card.Text>
              {/* --- 2. This is the line that needed the import --- */}
              <Button as={Link} to="/users" variant="primary">
                Manage Users
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Chart: User Status --- */}
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-center">User Status</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.statusBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {stats.statusBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_STATUS[index % COLORS_STATUS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* --- Chart: User Roles --- */}
        <Col md={4} className="mb-4">
          <Card className="h-100">
            <Card.Body>
              <Card.Title className="text-center">User Roles</Card.Title>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={stats.roleBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {stats.roleBreakdown.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS_ROLES[index % COLORS_ROLES.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    );
  };

  return (
    <Container fluid>
      <h2 className="mb-3">Dashboard</h2>
      <p className="text-muted">
        Welcome, {user ? user.username : 'Admin'}!
      </p>

      {renderContent()}
    </Container>
  );
};

export default DashboardPage;