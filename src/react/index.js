import createElement, { cloneElement, memo } from './createElement'
import Component, { PureComponent } from './component'
import { createRef, forwardRef } from './ref'
import createContext from './createContext'
import { useState, useReducer, useMemo, useCallback, useEffect, useLayoutEffect, useRef, useImperativeHandle, useContext } from './hooks'

const React = {
  createElement,
  Component,
  PureComponent,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  memo,
  useState,
  useReducer,
  useMemo,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useImperativeHandle,
  useContext,
}

export default React