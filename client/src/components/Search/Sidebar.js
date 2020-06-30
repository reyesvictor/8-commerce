import React, { Component } from "react";
import $ from "jquery";
import Dropdown from "react-bootstrap/Dropdown";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Collapse from "react-bootstrap/Collapse";
import ReactBootstrapSlider from "react-bootstrap-slider";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";
import "./Sidebar.css";
import axios from "axios";
import Results from "./Results";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {TransitionGroup, CSSTransition, SwitchTransition} from 'react-transition-group';
import Footer from '../footer/Footer';
import { Controls } from "react-gsap";


export default class SearchSidebar extends Component {
  constructor() {
    super();

    this.state = {
      sliderCurrentValue: [0, 5000],
      sliderStep: 50,
      sliderMax: 5000,
      sliderMin: 0,

      sexe: null,
      size: [],
      color: [],
      subcategory: null,
      category: null,
      orderBy: "Popularity",
      sortBy: "desc",

      subcategories: null,
      isSubCategoryReady: false,

      categories: null,
      isCategoryReady: false,

      colors: null,
      isColorsReady: false,
      limitColors: 4,

      showFilter: false,
      displayMethod: "square",

      isResultsReady: false,

      searchValue: null,

      resultExist: true,

      justArrived: true,
    };

    this.baseState = this.state;

    this.handleName = this.handleName.bind(this);
    this.sliderChangeValue = this.sliderChangeValue.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSexe = this.handleSexe.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleColor = this.handleColor.bind(this);
    this.handleSubCategory = this.handleSubCategory.bind(this);
    this.handleCategory = this.handleCategory.bind(this);
    this.handleOrderBy = this.handleOrderBy.bind(this);
    this.handleSortBy = this.handleSortBy.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.checkEmptyArray = this.checkEmptyArray.bind(this);
    this.checkNull = this.checkNull.bind(this);
    this.showFilter = this.showFilter.bind(this);
    this.defaultValueSexe = this.defaultValueSexe.bind(this);
    this.defaultValueName = this.defaultValueName.bind(this);
    this.handleSubmitEnter = this.handleSubmitEnter.bind(this);
    this.handleDisplayMethod = this.handleDisplayMethod.bind(this);
    this.handleMoreColors = this.handleMoreColors.bind(this);
  }

  // static propTypes = {
  //   location: React.PropTypes.object.isRequired
  // }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }
  
  onRouteChanged() {
    this.loadSearchData();
  }


  handleSubmitEnter(e) {
    if (e.keyCode === 13) {
      this.handleSubmit()
    }
    else if (e.keyCode === 27) {
      this.setState({showFilter: false})
    }
  }

  handleName(e) {
    this.setState({ searchValue: e.target.value});
    // this.handleSubmit();
  }

  async sliderChangeValue(e) {
    await this.setState({ sliderCurrentValue: e.target.value, isResultsReady: false });
    this.handleSubmit();
  }

  async handleSexe(e) {
    await this.setState({ sexe: e.target.value, isResultsReady: false });
    this.handleSubmit();
  }

  async handleSize(e) {
    let sizes = this.state.size;
    let checkSize = sizes.indexOf(e.target.value);
    let newSizes = [...sizes];

    if (checkSize === -1) {
      newSizes.push(e.target.value);
    } else {
      for (var i = 0; i < newSizes.length; i++) {
        if (newSizes[i] === e.target.value) {
          newSizes.splice(i, 1);
          i--;
        }
      }
    }

    await this.setState({ size: newSizes });
    this.handleSubmit();
  }

  async handleColor(e) {
    let colors = this.state.color;
    let checkColor = colors.indexOf(e.target.value);
    let newColors = [...colors];

    if (checkColor === -1) {
      newColors.push(e.target.value);
    } else {
      for (var i = 0; i < newColors.length; i++) {
        if (newColors[i] === e.target.value) {
          newColors.splice(i, 1);
          i--;
        }
      }
    }

    await this.setState({ color: newColors });
    this.handleSubmit();
  }

  async handleSubCategory(e) {
    e.preventDefault();

    console.log(e.target.value);
    await this.setState({ subcategory: e.target.value });
    this.handleSubmit();
  }

  async handleCategory(e) {
    e.preventDefault();

    console.log(e.target.value);
    this.setState({ category: e.target.value });

    await axios
      .get(process.env.REACT_APP_API_LINK + "/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, subcategory: null, isCategoryReady: true });

        res.data.data.map(cat => {
          if ( this.state.category == cat.name ) {
            this.setState({ subcategories: cat.subCategories, isSubCategoryReady: true });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });
    this.handleSubmit();
  }

  async handleOrderBy(e) {
    await this.setState({ orderBy: e.target.text });
    this.handleSubmit()
  }

  async handleSortBy(e) {
    await this.setState({ sortBy: e.target.value });
    this.handleSubmit()
  }

  handleMoreColors() {
    if (this.state.limitColors == 4){
      this.setState({limitColors: 10000})
      $('#link-more-colors').text('- Hide Colors')
    }
    else {
      this.setState({limitColors: 4})
      $('#link-more-colors').text('+ More Colors')
    }
  }

  checkEmptyArray(array) {
    if (array.length > 0) {
      return array;
    } else {
      return null;
    }
  }

  checkNull(value) {
    if (value == ''){
      return true;
    }
  }

  handleSubmit(e) {
    let jsonRequest = {
      price: {
        start: this.state.sliderCurrentValue[0],
        end: this.state.sliderCurrentValue[1],
      },
      sex: this.state.sexe,
      size: this.checkEmptyArray(this.state.size),
      color: this.checkEmptyArray(this.state.color),
      subcategory: this.checkNull(this.state.subcategory) ? null : this.state.subcategory,
      category: this.checkNull(this.state.category) ? null : this.state.category,
      order_by: this.state.orderBy.toLowerCase(),
      order_by_sort: this.state.sortBy,
      search: this.state.searchValue
    };

    if (e) {
      e.preventDefault();
    }
    
    console.log(jsonRequest);

    this.setState({ isResultsReady: false });

    const header = { "Content-Type": "application/json" };

    axios
      .post(
        process.env.REACT_APP_API_LINK + "/api/product/filter?offset=0&limit=10",
        jsonRequest,
        { headers: header }
      )
      .then((res) => {
        console.log(res.data)
        
        this.setState({results: res.data, isResultsReady: true});
        // if (this.state.showFilter == true){
        //   this.showFilter()
        // }
      })
      .catch((error) => {
        console.log(error.response);
      });
  }

  showFilter() {
    this.setState({ showFilter: !this.state.showFilter, justArrived: false });
  }

  async handleDisplayMethod(e) {
    await this.setState({ displayMethod: e.target.value, isResultsReady: false });
    this.handleSubmit();
  }

  componentDidMount() {
    this.loadSearchData();
  }

  loadSearchData = () => {
    this.setState(this.baseState);
    let paramsURL = this.props.location.search.substr(1).split("=")
  
    if (paramsURL[0] == "sexe") {
      this.defaultValueSexe(paramsURL[1])

      axios
        .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get(process.env.REACT_APP_API_LINK + "/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }

    if (paramsURL[0] == "name") {
      this.defaultValueName(paramsURL[1])

      axios
        .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get(process.env.REACT_APP_API_LINK + "/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }

    else if (paramsURL[0] == "subcategory") {
      this.defaultValueSubCategory(paramsURL[1])
      console.log(paramsURL[1])

    }

    else if (paramsURL[0] == "category") {
      this.defaultValueCategory(paramsURL[1])
      
      axios
      .get(process.env.REACT_APP_API_LINK + "/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, isCategoryReady: true });

        res.data.data.map(cat => {
          if ( this.state.category == cat.name ) {
            this.setState({ subcategories: cat.subCategories, isSubCategoryReady: true });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });
    }
    else {
      axios
        .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
        .then((res) => {
          console.log(res.data);
          this.setState({ subcategories: res.data, isSubCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
  
      axios
        .get(process.env.REACT_APP_API_LINK + "/api/category/")
        .then((res) => {
          console.log(res.data.data);
          this.setState({ categories: res.data.data, isCategoryReady: true });
        })
        .catch((error) => {
          console.log(error.response);
        });
    }




    axios
      .get(process.env.REACT_APP_API_LINK + "/api/color/")
      .then((res) => {
        console.log(res.data);
        this.setState({ colors: res.data, isColorsReady: true });
      })
      .catch((error) => {
        console.log(error.response);
      });

      this.handleSubmit();
  }

  async defaultValueSubCategory(value) {
    this.setState({ subcategory: value });

    await axios
      .get(process.env.REACT_APP_API_LINK + "/api/subcategory/")
      .then( (res) => {
        console.log(res.data);

        res.data.map(  subcat => {
          // console.log(subcat)
          if ( this.state.subcategory == subcat.name ) {
            this.setState({ 
              subcategories: [{id: subcat.id, name: subcat.name}], 
              category: subcat.Category.name
              // categories: [{name: subcat.Category.name, id: subcat.Category.id 
              });
          }
        })
      })
      .catch((error) => {
        console.log(error.response);
      });

    axios
      .get(process.env.REACT_APP_API_LINK + "/api/category/")
      .then(async (res) => {
        console.log(res.data.data);
        await this.setState({ categories: res.data.data, isCategoryReady: true });

        this.setState({isSubCategoryReady: true })
      })
      .catch((error) => {
        console.log(error.response);
      });

      this.handleSubmit()
  }

  async defaultValueCategory(value) {
    await this.setState({ category: value });
    this.handleSubmit()
  }

  async defaultValueSexe(value) {
    await this.setState({sexe: value})
    this.handleSubmit();
  }

  async defaultValueName(value) {
    await this.setState({searchValue: value})
    $('#inputSearchName').val(value);
    this.handleSubmit();
  }

  

  render() {
    const isCategoryReady = this.state.isCategoryReady
    const isColorReady = this.state.isColorsReady;
    const isSubCategoriesReady = this.state.isSubCategoryReady;

    const sortChecked = this.state.sortBy;
    const results = this.state.results;
    const displayMethod = this.state.displayMethod;

    const justArrived = this.state.justArrived;

    return (
      <>
        {/* FILTERS */}
        <div
          className={this.state.showFilter ? "to-right" : justArrived ? "d-none" : "to-left" }
          id="filter-div"
        >
          <i className="material-icons md-18 float-right" onClick={this.showFilter} id="btn-close-filter">close</i>
          {/* Price */}
          <div className="form-group d-block mt-3">
            <label htmlFor="formControlRange" className="filter-label">Price</label>
            <br />
            
            <div className="f-slider-val f-border">
              <span>
                {this.state.sliderCurrentValue[0]+ " €"}
              </span>
              <span className="float-right">
                {this.state.sliderCurrentValue[1]+ " €"}
              </span>
            </div>
            <ReactBootstrapSlider
              value={this.state.sliderCurrentValue}
              change={this.sliderChangeValue}
              step={this.state.sliderStep}
              max={this.state.sliderMax}
              min={this.state.sliderMin}
              range={true}
              className="f-border"
              id="slider"
            />
          </div>

          {/* Gender */}
          <div className="form-group f-gender">
            <span className="filter-label">Gender</span><br/>
            <div className="form-check f-border mr-5">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="optradio"
                  value="H"
                  onChange={this.handleSexe}
                  checked={this.state.sexe == 'H' ? true : false}
                />
                Men
              </label>
            </div>
            <div className="form-check">
              <label className="form-check-label">
                <input
                  type="radio"
                  className="form-check-input"
                  name="optradio"
                  value="F"
                  onChange={this.handleSexe}
                  checked={this.state.sexe == 'F' ? true : false}
                />
                Women
              </label>
            </div>
          </div>

          {/* Size */}
          <div className="form-group ">
            <span className="filter-label">Size</span><br/>
            <div className="form-check form-check-inline f-border">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xs"
                value="xs"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xs">
                XS
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-s"
                value="s"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-s">
                S
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-m"
                value="m"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-m">
                M
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-l"
                value="l"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-l">
                L
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xl"
                value="xl"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xl">
                XL
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                id="size-xxl"
                value="xxl"
                onChange={this.handleSize}
              />
              <label className="form-check-label" htmlFor="size-xxl">
                XXL
              </label>
            </div>
          </div>

          {/* Color */}
          <div className="form-group ">
            <span className="filter-label">Color</span><br/>

            {isColorReady
                ? this.state.colors.slice(0, this.state.limitColors).map(color => (
                  <>
                  <div className="form-check form-check-inline f-border" key={color.id}>
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={color.id}
                      value={color.name.toLowerCase()}
                      onChange={this.handleColor}
                    />
                    <label className="form-check-label" htmlFor={color.id}>
                      {color.name}
                    </label>
                  </div><br/></>
                  ))
                : null
            }
            <a href="#" id="link-more-colors" className="f-border md-force-align" onClick={this.handleMoreColors}>+ More colors</a>
          </div>

          {/* Category */}
          <div className="form-group ">
            <label htmlFor="sel1 col-2">
              <span className="filter-label">Category</span>
            </label>

            <select
              className="col-10 form-control f-border"
              id="sel1"
              onChange={this.handleCategory}
            >
              
              <option defaultValue="null"></option>

              {isCategoryReady
                ? 
                this.state.categories.map((category) => (
                  <option key={category.id} value={category.name} >
                    {category.name}
                  </option>
                ))                    
                : null}
            </select>
          </div>

          {/* Subcategory */}
          <div className="form-group">
            <label htmlFor="sel1 col-2">
              <span className="filter-label">Subcategory</span>
            </label>

            <select
              className="col-10 form-control f-border f-select"
              id="sel1"
              onChange={this.handleSubCategory}
            >

              <option value={null}></option>

              {isSubCategoriesReady && this.state.subcategories
                ? 
                this.state.subcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.name} >
                    {subcategory.name}
                  </option>
                ))                    
                : null}
            </select>
          </div>

          {/* Search button w/ filters */}
          <div className="row">
            <button
              type="submit"
              className="btn m-auto"
              onClick={this.handleSubmit}
            >
              Search
            </button>
          </div>
        </div>
            

        <div className="container">
          <ToastContainer />


            
            {/* SEARCH BAR */}
            <div className="row justify-content-center d-inline md-force-align">
              <i className="material-icons md-24">search</i>
              <input
                type="search"
                placeholder="Search product..."
                className="col-12 clear"
                onChange={this.handleName}
                id="inputSearchName"
                onKeyDown={this.handleSubmitEnter}
                autoComplete="off"
              ></input>
              {/* <button type="submit" className="btn btn-dark col-1 mt-0 ml-2 p-0" onClick={this.handleSubmit}>
                Search
                </button> */}
              
            </div>

            {/* SORT/ORDER BY */}
            <div className="row mt-2 p-3">
                <div className="mr-auto">
                  <span
                  className="small text-secondary md-force-align"
                  id="filter-link"
                  onClick={this.showFilter}
                  aria-controls="filter-div"
                  aria-expanded={this.state.showFilter}
                  >
                    {this.state.showFilter 
                    ? <span className="pb-1"><i className="material-icons md-18 pr-1">chevron_left</i> Hide Filters</span> 
                    : <span className="pb-1"><i className="material-icons md-18 pr-1">filter_alt</i> Show Filters</span> }
                  
                  </span>
                </div>

                <div className="row">
                  <Dropdown>
                    <ButtonGroup 
                    className="btn-sm"
                    toggle
                    >
                      <ToggleButton
                        type="radio"
                        variant="secondary"
                        name="radio"
                        value="asc"
                        checked={sortChecked == "asc"}
                        onChange={this.handleSortBy}
                        className="btn-sm"
                      >
                        ASC
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="secondary"
                        name="radio"
                        value="desc"
                        checked={sortChecked == "desc"}
                        onChange={this.handleSortBy}
                        className="btn-sm"
                      >
                        DESC
                      </ToggleButton>
                    </ButtonGroup>

                  
                    <span className="ml-2 mr-2 small">Order by</span>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic" size="sm">
                      {this.state.orderBy}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item onClick={this.handleOrderBy}>
                        Popularity
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.handleOrderBy}>
                        Price
                      </Dropdown.Item>
                      <Dropdown.Item onClick={this.handleOrderBy}>Name</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <ButtonGroup 
                    className="btn-sm md-force-align"
                    toggle
                    >
                      <ToggleButton
                        type="radio"
                        variant="light"
                        name="radio"
                        value="square"
                        checked={displayMethod == "square"}
                        onChange={this.handleDisplayMethod}
                        className="btn-sm"
                      >
                        <i className="material-icons md-18 icon-filter">view_module</i>
                      </ToggleButton>
                      <ToggleButton
                        type="radio"
                        variant="light"
                        name="radio"
                        value="line"
                        checked={displayMethod == "line"}
                        onChange={this.handleDisplayMethod}
                        className="btn-sm"
                      >
                        <i className="material-icons md-18 icon-filter">view_list</i>
                      </ToggleButton>
                    </ButtonGroup>
                </div>
            </div>

            <CSSTransition
              in={this.state.isResultsReady}
              timeout={600}
              classNames="results"
              unmountOnExit
              appear
            >
              <Results results={results} display={displayMethod}/>
            </CSSTransition>
        </div>
        <div className="col-sm-12 mt-5">
          <Footer />
        </div>
      </>
    );
  }

}