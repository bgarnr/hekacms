import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { BlankPage } from "./pages/BlankPage"
import { Dashboard } from "./pages/Dashboard"
import { ContentTypes } from "./pages/ContentTypes"
import { ContentInstances } from "./pages/ContentInstances"
import { PageBuilder } from "./pages/PageBuilder"
import { CreateContent } from "./pages/CreateContent"

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute> <Layout /> </ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="content-types" element={<ContentTypes />} />
                <Route path="content-instances" element={<ContentInstances />} />
                <Route path="create-content" element={<CreateContent />} />
                <Route path="page-builder" element={<PageBuilder />} />
              </Route>
              <Route path="*" element={<BlankPage />} />
            </Routes>
          </Router>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App