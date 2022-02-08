import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import ROUTES, { SecondaryRoutes } from '@common/const/routes'
import MainLayout from '@components/layouts/mainLayout'
import { inject, observer } from 'mobx-react'
const Routers = props => {
  const { server } = props
  function renderRoutes(list = ROUTES) {
    return list.map(item => {
      if (
        !server.is_transfer &&
        (item.path === '/mobilityMining' ||
          item.path === '/mobilityPool' ||
          item.path === '/forceMining')
      ) {
        return null
      }
      if (item.path === "/dao") return null;
      // if (item.path === "/plan") return null;
      if (item.path === "/lottery") return null;
      if (item._target) return null;
      const props = {
        path: item.path,
        // component: item.component,
        exact: true,
        render: () => {
          return item.component
        }
      }
      // 有子节点
      if (item.children && item.children.length) {
        return [
          ...renderRoutes(item.children),
          <Route key={item.path} {...props} />
        ]
      }
      return <Route key={item.path} {...props} />
    })
  }

  return (
    <Router>
      <Route
        render={({ location }) => {
          return (
            <MainLayout>
              <Switch location={location}>
                {/* {!!ROUTES[0].children && !!ROUTES[0].children.length && (
                  <Route
                    exact
                    path={["/"]}
                    render={() => <Redirect to="/home" />}
                  />
                )} */}
                {renderRoutes()}
                {renderRoutes(SecondaryRoutes)}
                <Redirect to="/home" />
              </Switch>
            </MainLayout>
          )
        }}
      />
    </Router>
  )
}

export default inject('server')(observer(Routers))
