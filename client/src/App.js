import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';
import { Container } from 'reactstrap';
import IndexNavbar from './components/IndexNavbar';
import UserPosts from './components/posts/UserPosts';
import PostDetail from './components/posts/PostDetail';
import SearchPost from './components/posts/SearchPost';
import UserList from './components/user/UserList';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import Product from './components/products/product.details';
import Home from './components/home/home';
import AccessAdmin from './components/Admin/AccessAdmin';
import NotFound from './components/NotFound/NotFound';
import AccessCreateCategory from './components/Admin/CreateCategory/AccessCreateCategory';
import AccessCreateSubCategory from './components/Admin/CreateCategorySub/AccessCreateSubCategory';
import AccessCreateProduct from './components/Admin/CreateProduct/AccessCreateProduct';
import AccessUpdateProduct from './components/Admin/UpdateProduct/AccessUpdateProduct';
import AccessCreateSubProduct from './components/Admin/CreateSubProduct/AccessCreateSubProduct';
import AccessSubProductInterface from './components/Admin/SubProduct/AccessSubProductInterface';
import AccessUpdateSubProduct from './components/Admin/UpdateSubProduct/AccessUpdateSubProduct';
import AccessSubCategoryInterface from './components/Admin/SubCategory/AccessSubCategoryInterface';
import CreateImage from './components/Admin/CreateImage/CreateImage';
import SearchSidebar from './components/Search/Sidebar'
import CreateImageSubproduct from './components/Admin/CreateImage/CreateImageSubproduct';
import AccessUpdateCategory from './components/Admin/UpdateCategory/AccessUpdateCategory';
import AccessUpdateSubCategory from './components/Admin/UpdateSubCategory/AccessUpdateSubCategoy';


class App extends React.Component {

    async componentDidMount() {
        if(localStorage.getItem('token')) await store.dispatch(loadUser());
    }

    render() {
        console.log(store.getState().auth);
        return (
            //<Product />
            
            <Provider store={store}>
                <Router>
                <IndexNavbar />
                    <Switch>
                        <Route exact path="/" component={Home} />
                        <Route exact path="/product/:id" component={Product} />
                        <Route exact path="/search" component={SearchSidebar} />
                        <Route exact path="/admin" component={AccessAdmin} />
                        <Route exact path="/admin/subcategory/:id"component={AccessSubCategoryInterface} />
                        <Route exact path="/admin/subproduct/:id" component={AccessSubProductInterface} />
                        <Route exact path="/admin/subproduct/:id/create" component={AccessCreateSubProduct} />
                        <Route exact path="/admin/subproduct/:id/:subproduct/update" component={AccessUpdateSubProduct} />
                        <Route exact path="/admin/create/product" component={AccessCreateProduct} />
                        <Route exact path="/admin/create/category" component={AccessCreateCategory} />
                        <Route exact path="/admin/create/subcategory" component={AccessCreateSubCategory} />
                        <Route exact path="/admin/create/image/:idproduct" component={CreateImage} />
                        <Route exact path="/admin/create/image/:idproduct/:idsubproduct" component={CreateImageSubproduct} />
                        <Route exact path="/admin/update/product/:id" component={AccessUpdateProduct} />
                        <Route exact path="/admin/update/category/:id" component={AccessUpdateCategory} />
                        <Route path='*' exact={true} component={NotFound} />
                    </Switch>
                </Router>
            </Provider>
        
        )
    }
}

export default App;